import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { TipoBandeja } from "../src/TipoBandeja";
import { Filtro } from "../src/Filtro";

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
            [ivan.getEmail(), buzonIvan],
            [mariano.getEmail(), buzonMariano],
            [pepe.getEmail(), buzonPepe],
            [carlos.getEmail(), buzonCarlos]
        ]);

        const servicioIvan = new ServicioEnvio(buzonIvan, buzones);
        const servicioMariano = new ServicioEnvio(buzonMariano, buzones);
        const correo = new Correo(ivan, [mariano, pepe, carlos], "Reunión", "Nos juntamos el martes");

        servicioIvan.enviar(correo);

        expect(buzonIvan.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
        expect(buzonIvan.obtener(TipoBandeja.ENTRADA).length).toBe(0);   // Ivan no se lo manda a sí mismo

        [buzonMariano, buzonPepe, buzonCarlos].forEach(buzon => {
            const recibidos = buzon.obtener(TipoBandeja.ENTRADA);
            expect(recibidos.length).toBe(1);
            expect(recibidos[0].getAsunto()).toBe("Reunión");
            expect(recibidos[0].getRemitente()).toBe(ivan);
        });

        // Mariano le contesta a Ivan con su propio servicio
        const respuesta = new Correo(mariano, [ivan], "Re: Reunión", "Dale, ahí estoy");
        servicioMariano.enviar(respuesta);

        expect(buzonMariano.obtener(TipoBandeja.ENVIADOS)).toEqual([respuesta]);
        expect(buzonIvan.obtener(TipoBandeja.ENTRADA).length).toBe(1);   // ahora Ivan sí recibe
        expect(buzonPepe.obtener(TipoBandeja.ENTRADA).length).toBe(1);   // Pepe sigue con el suyo
    });

    it("si un destinatario elimina el correo, los demás lo siguen teniendo en su Entrada", () => {
        const buzonIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const buzonPepe = new GestorBandejas();

        const buzones = new Map([
            [mariano.getEmail(), buzonMariano],
            [pepe.getEmail(), buzonPepe]
        ]);

        const servicio = new ServicioEnvio(buzonIvan, buzones);
        servicio.enviar(new Correo(ivan, [mariano, pepe], "Reunión", "Nos juntamos el martes"));

        const delMariano = buzonMariano.obtener(TipoBandeja.ENTRADA)[0];
        buzonMariano.eliminar(delMariano.getId());

        expect(buzonMariano.obtener(TipoBandeja.ENTRADA).length).toBe(0);
        expect(buzonMariano.obtener(TipoBandeja.ELIMINADOS).length).toBe(1);
        expect(buzonPepe.obtener(TipoBandeja.ENTRADA).length).toBe(1);        // Pepe no se entera
        expect(buzonIvan.obtener(TipoBandeja.ENVIADOS).length).toBe(1);       // Ivan sigue con su Enviado
    });

    it("filtra los correos de un remitente entre 100 de la Entrada", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const deMariano = gestor.obtener(TipoBandeja.ENTRADA).filter(esDeMariano);
        //bandeja de entrada de tal usuario

        expect(gestor.cantidad(TipoBandeja.ENTRADA)).toBe(100);
        expect(deMariano.length).toBe(50);   // los pares
    });

    it("filtra los correos de un remitente entre 100 de la Entrada", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const filtro = new Filtro("De Mariano", esDeMariano);
        const deMariano = filtro.aplicar(gestor.obtener(TipoBandeja.ENTRADA));

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