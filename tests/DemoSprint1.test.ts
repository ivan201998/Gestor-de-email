import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { TipoBandeja } from "../src/TipoBandeja";

const ana = new Contacto("Ana López", "ana@ucp.edu.ar");
const juan = new Contacto("Juan Pérez", "juan@gmail.com");
const luis = new Contacto("Luis Gómez", "luis@ucp.edu.ar");
const marta = new Contacto("Marta Díaz", "marta@ucp.edu.ar");

// Carga 100 correos en la Entrada: pares de Juan, impares de Luis; múltiplos de 5 son urgentes.
function cargarCienCorreos(gestor: GestorBandejas): void {
    for (let i = 1; i <= 100; i++) {
        const remitente = i % 2 === 0 ? juan : luis;
        const asunto = i % 5 === 0 ? "Urgente " + i : "Aviso " + i;
        gestor.agregar(new Correo(remitente, [ana], asunto, "texto"), TipoBandeja.ENTRADA);
    }
}

// Condiciones (predicados): reciben un correo y responden true o false.
const esDeJuan = (correo: Correo) => correo.getRemitente().getEmail() === "juan@gmail.com";
const esUrgente = (correo: Correo) => correo.getAsunto().includes("Urgente");

describe("Escenario del Sprint 1", () => {
    it("un correo a 3 destinatarios llega a la Entrada de cada uno", () => {
        const buzonAna = new GestorBandejas();
        const buzonJuan = new GestorBandejas();
        const buzonLuis = new GestorBandejas();
        const buzonMarta = new GestorBandejas();

        const buzones = new Map([
            [juan.getEmail(), buzonJuan],
            [luis.getEmail(), buzonLuis],
            [marta.getEmail(), buzonMarta]
        ]);

        const servicio = new ServicioEnvio(buzonAna, buzones);
        const correo = new Correo(ana, [juan, luis, marta], "Reunión", "Nos juntamos el martes");

        servicio.enviar(correo);

        expect(buzonAna.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
        expect(buzonJuan.obtener(TipoBandeja.ENTRADA)).toEqual([correo]);
        expect(buzonLuis.obtener(TipoBandeja.ENTRADA)).toEqual([correo]);
        expect(buzonMarta.obtener(TipoBandeja.ENTRADA)).toEqual([correo]);
    });
        it("filtra los correos de un remitente entre 100 de la Entrada", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const deJuan = gestor.obtener(TipoBandeja.ENTRADA).filter(esDeJuan);

        expect(gestor.cantidad(TipoBandeja.ENTRADA)).toBe(100);
        expect(deJuan.length).toBe(50);   // los pares
    });

    it("filtro compuesto: de Juan Y urgente", () => {
        const gestor = new GestorBandejas();
        cargarCienCorreos(gestor);

        const urgenteDeJuan = (correo: Correo) => esDeJuan(correo) && esUrgente(correo);
        const resultado = gestor.obtener(TipoBandeja.ENTRADA).filter(urgenteDeJuan);

        expect(resultado.length).toBe(10);   // pares y múltiplos de 5 = múltiplos de 10
    });
});