import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { GestorBorradores } from "../src/GestorBorradores";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { EstadisticasCorreos } from "../src/EstadisticasCorreos";
import { TipoBandeja } from "../src/TipoBandeja";
import { asuntoContiene, deRemitente, y } from "../src/Predicado";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

// Carga 100 correos en la Entrada: pares de Mariano, impares de Pepe; múltiplos de 5 son urgentes.
function cargarCienCorreos(gestor: GestorBandejas): void {
    for (let i = 1; i <= 100; i++) {
        const remitente = i % 2 === 0 ? mariano : pepe;
        const asunto = i % 5 === 0 ? "Urgente " + i : "Aviso " + i;
        gestor.agregar(new Correo(remitente, [ivan], asunto, "texto"), TipoBandeja.ENTRADA);
    }
}

describe("Escenario del Sprint 3", () => {
        it("RF-07: Ivan arma un borrador en dos pasos y los cambios se guardan", () => {
        const buzonIvan = new GestorBandejas();
        const borradores = new GestorBorradores(buzonIvan);

        const borrador = borradores.crear(ivan);
        borradores.editar(borrador.getId(), { asunto: "Reunión" });
        borradores.editar(borrador.getId(), { cuerpo: "Nos vemos el lunes", destinatarios: [mariano] });

        expect(borradores.listar().length).toBe(1);
        expect(borrador.getAsunto()).toBe("Reunión");
        expect(borrador.getCuerpo()).toBe("Nos vemos el lunes");
        expect(borrador.getDestinatarios().length).toBe(1);
    });

    it("RF-07: un borrador completo se envía y le llega a Mariano", () => {
        const buzonIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const borradores = new GestorBorradores(buzonIvan);
        const servicio = new ServicioEnvio(buzonIvan, new Map([[mariano.getEmail(), buzonMariano]]));

        const borrador = borradores.crear(ivan);
        borradores.editar(borrador.getId(), { asunto: "Reunión", destinatarios: [mariano] });
        servicio.enviar(borrador);

        expect(buzonIvan.cantidad(TipoBandeja.BORRADORES)).toBe(0);
        expect(buzonIvan.cantidad(TipoBandeja.ENVIADOS)).toBe(1);
        expect(buzonMariano.cantidad(TipoBandeja.ENTRADA)).toBe(1);
    });

    it("RF-07: un borrador sin destinatarios no se envía y sigue en Borradores", () => {
        const buzonIvan = new GestorBandejas();
        const borradores = new GestorBorradores(buzonIvan);
        const servicio = new ServicioEnvio(buzonIvan);

        const borrador = borradores.crear(ivan);
        borradores.editar(borrador.getId(), { asunto: "Reunión" });

        expect(() => servicio.enviar(borrador)).toThrow("destinatarios");
        expect(buzonIvan.cantidad(TipoBandeja.BORRADORES)).toBe(1);
    });

    it("RF-10 (map): saca los asuntos de los 100 correos", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const estadisticas = new EstadisticasCorreos(gestor);

        const asuntos = estadisticas.asuntos(TipoBandeja.ENTRADA);

        expect(asuntos.length).toBe(100);
        expect(asuntos[0]).toBe("Aviso 1");
        expect(asuntos[4]).toBe("Urgente 5");
    });

    it("RF-10 (filter): los urgentes de Mariano son 10", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const estadisticas = new EstadisticasCorreos(gestor);

        const urgentesDeMariano = estadisticas.filtrar(
            TipoBandeja.ENTRADA,
            y(asuntoContiene("Urgente"), deRemitente("mariano@gmail.com"))
        );

        expect(urgentesDeMariano.length).toBe(10);   // múltiplos de 10
    });

    it("RF-10 (reduce): al leer los 20 urgentes quedan 80 no leídos", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const estadisticas = new EstadisticasCorreos(gestor);

        expect(estadisticas.totalNoLeidos(TipoBandeja.ENTRADA)).toBe(100);

        estadisticas.filtrar(TipoBandeja.ENTRADA, asuntoContiene("Urgente"))
            .forEach(correo => correo.marcarLeido());

        expect(estadisticas.totalNoLeidos(TipoBandeja.ENTRADA)).toBe(80);
    });
});
