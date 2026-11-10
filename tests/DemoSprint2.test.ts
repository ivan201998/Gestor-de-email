import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { BuscadorCorreos } from "../src/BuscadorCorreos";
import { ConsultaCorreos } from "../src/ConsultaCorreos";
import { Filtro } from "../src/Filtro";
import { RegistroFiltros } from "../src/RegistroFiltros";
import { VistaFavoritos } from "../src/VistaFavoritos";
import { asuntoContiene, deRemitente, estaLeido, no, o, y } from "../src/Predicado";

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

describe("Escenario del Sprint 2", () => {
    it("RF-04: busca entre 100 correos sin importar mayúsculas", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const buscador = new BuscadorCorreos(gestor);

        expect(buscador.buscar("URGENTE").length).toBe(20);   // múltiplos de 5
        expect(buscador.buscar("pepe").length).toBe(50);      // nombre del remitente
        expect(buscador.buscar("zzz").length).toBe(0);
    });

    it("RF-08: al leer un correo baja la cantidad de no leídos", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const consulta = new ConsultaCorreos(gestor);

        expect(consulta.noLeidos(TipoBandeja.ENTRADA).length).toBe(100);
        gestor.obtener(TipoBandeja.ENTRADA)[0].marcarLeido();
        expect(consulta.noLeidos(TipoBandeja.ENTRADA).length).toBe(99);
    });

    it("RF-05: filtro con O (de Mariano O urgente)", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const registro = new RegistroFiltros();
        registro.agregar(new Filtro("Mariano o urgentes", o(deRemitente("mariano@gmail.com"), asuntoContiene("Urgente"))));

        const resultado = registro.aplicar("Mariano o urgentes", gestor.obtener(TipoBandeja.ENTRADA));

        expect(resultado.length).toBe(60);   // 50 de Mariano + 10 urgentes impares
    });

    it("RF-05: el filtro 'Pendientes' se actualiza solo al leer un correo", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const registro = new RegistroFiltros();
        registro.agregar(new Filtro("Pendientes", no(estaLeido)));
        const entrada = gestor.obtener(TipoBandeja.ENTRADA);

        expect(registro.aplicar("Pendientes", entrada).length).toBe(100);
        entrada[0].marcarLeido();
        expect(registro.aplicar("Pendientes", entrada).length).toBe(99);
    });

    it("RF-05: no deja guardar más de 5 filtros", () => {
        const registro = new RegistroFiltros();
        for (let i = 1; i <= 5; i++) {
            registro.agregar(new Filtro("Filtro " + i, asuntoContiene("Urgente")));
        }

        expect(() => registro.agregar(new Filtro("Filtro 6", asuntoContiene("Aviso")))).toThrow();
    });

    it("RF-09: un favorito eliminado sale de la vista y vuelve al restaurarlo", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const favoritos = new VistaFavoritos(gestor);
        const primero = gestor.obtener(TipoBandeja.ENTRADA)[0];

        primero.marcarFavorito();
        expect(favoritos.obtener().length).toBe(1);

        gestor.eliminar(primero.getId());
        expect(favoritos.obtener().length).toBe(0);

        gestor.restaurar(primero.getId());
        expect(favoritos.obtener().length).toBe(1);
    });
        it("RF-05: filtro compuesto (urgente Y (de Mariano O de Pepe) Y NO leído)", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const registro = new RegistroFiltros();
        const seguimiento = y(
            asuntoContiene("Urgente"),
            y(o(deRemitente("mariano@gmail.com"), deRemitente("pepe@ucp.edu.ar")), no(estaLeido))
        );
        registro.agregar(new Filtro("Seguimiento", seguimiento));
        const entrada = gestor.obtener(TipoBandeja.ENTRADA);

        expect(registro.aplicar("Seguimiento", entrada).length).toBe(20);

        registro.aplicar("Seguimiento", entrada)[0].marcarLeido();

        expect(registro.aplicar("Seguimiento", entrada).length).toBe(19);
    });
        it("RF-09: busca con un filtro dentro de los favoritos", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);
        const favoritos = new VistaFavoritos(gestor);
        const entrada = gestor.obtener(TipoBandeja.ENTRADA);

        entrada.slice(0, 10).forEach(correo => correo.marcarFavorito());   // los primeros 10 (del 1 al 10)

        const urgentesFavoritos = favoritos.obtenerFiltrados(new Filtro("Urgentes", asuntoContiene("Urgente")));

        expect(favoritos.obtener().length).toBe(10);
        expect(urgentesFavoritos.length).toBe(2);   // el 5 y el 10
    });
});