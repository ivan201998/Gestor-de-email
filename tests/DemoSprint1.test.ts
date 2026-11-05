import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { TipoBandeja } from "../src/TipoBandeja";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");
const carlos = new Contacto("Carlos Díaz", "carlos@ucp.edu.ar");

// Carga 100 correos en la Entrada: pares de Mariano, impares de Pepe; múltiplos de 5 son urgentes.
function cargarCienCorreos(gestor: GestorBandejas): void {
    for (let i = 1; i <= 100; i++) {
        const remitente = i % 2 === 0 ? mariano : pepe;
        const asunto = i % 5 === 0 ? "Urgente " + i : "Aviso " + i;
        gestor.agregar(new Correo(remitente, [ivan], asunto, "texto"), TipoBandeja.ENTRADA);
    }
}

// Condiciones (predicados): reciben un correo y responden true o false.
const esDeMariano = (correo: Correo) => correo.getRemitente().getEmail() === "mariano@gmail.com";
const esUrgente = (correo: Correo) => correo.getAsunto().includes("Urgente");

describe("Escenario del Sprint 1", () => {
        it("un correo a 3 destinatarios llega a la Entrada de cada uno", () => {
        const buzonIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const buzonPepe = new GestorBandejas();
        const buzonCarlos = new GestorBandejas();

        const buzones = new Map([
            [mariano.getEmail(), buzonMariano],
            [pepe.getEmail(), buzonPepe],
            [carlos.getEmail(), buzonCarlos]
        ]);

        const servicio = new ServicioEnvio(buzonIvan, buzones);
        const correo = new Correo(ivan, [mariano, pepe, carlos], "Reunión", "Nos juntamos el martes");

        servicio.enviar(correo);

        expect(buzonIvan.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);

        [buzonMariano, buzonPepe, buzonCarlos].forEach(buzon => {
            const recibidos = buzon.obtener(TipoBandeja.ENTRADA);
            expect(recibidos.length).toBe(1);
            expect(recibidos[0].getAsunto()).toBe("Reunión");
            expect(recibidos[0].getRemitente()).toBe(ivan);
        });
    });

    it("filtra los correos de un remitente entre 100 de la Entrada", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const deMariano = gestor.obtener(TipoBandeja.ENTRADA).filter(esDeMariano);

        expect(gestor.cantidad(TipoBandeja.ENTRADA)).toBe(100);
        expect(deMariano.length).toBe(50);   // los pares
    });

    it("filtro compuesto: de Mariano Y urgente", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const urgenteDeMariano = (correo: Correo) => esDeMariano(correo) && esUrgente(correo);
        const resultado = gestor.obtener(TipoBandeja.ENTRADA).filter(urgenteDeMariano);

        expect(resultado.length).toBe(10);   // pares y múltiplos de 5 = múltiplos de 10
    });
});