import { describe, it, expect } from "vitest";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

describe("Correo", () => {
    it("guarda el asunto y el cuerpo", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "Asunto de prueba", "Cuerpo de prueba");
        expect(correo.getAsunto()).toBe("Asunto de prueba");
        expect(correo.getCuerpo()).toBe("Cuerpo de prueba");
    });

    it("cada correo tiene un id distinto", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo1 = new Correo(remitente, [destinatario], "Uno", "texto");
        const correo2 = new Correo(remitente, [destinatario], "Dos", "texto");
        expect(correo1.getId()).not.toBe(correo2.getId());
    });

    it("modificar la lista de destinatarios devuelta no cambia el correo", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "Asunto", "texto");
        correo.getDestinatarios().pop();
        expect(correo.getDestinatarios().length).toBe(1);
    });

    it("un correo nuevo empieza como no leído y no favorito", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "Hola", "texto");
        expect(correo.estaLeido()).toBe(false);
        expect(correo.esFavorito()).toBe(false);
    });
        it("se puede marcar como leído y otra vez como no leído", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "Hola", "texto");

        correo.marcarLeido();
        expect(correo.estaLeido()).toBe(true);

        correo.marcarNoLeido();
        expect(correo.estaLeido()).toBe(false);
    });
    it("se crean varios correos con distintos remitentes y destinatarios, y cada uno guarda sus datos", () => {
        const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
        const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

        const primero = new Correo(ivan, [mariano], "Hola", "texto 1");
        const segundo = new Correo(pepe, [ivan, mariano], "Reunión", "texto 2");

        expect(primero.getRemitente()).toBe(ivan);
        expect(primero.getDestinatarios()).toEqual([mariano]);
        expect(segundo.getRemitente()).toBe(pepe);
        expect(segundo.getDestinatarios()).toEqual([ivan, mariano]);
        expect(primero.getId()).not.toBe(segundo.getId());
    });
});