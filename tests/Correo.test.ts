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

    it("un correo con remitente, asunto y destinatario es válido para enviar", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "Hola", "texto");
        expect(correo.esValidoParaEnviar()).toBe(true);
    });

    it("un correo sin asunto no es válido para enviar", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const destinatario = new Contacto("Mariano Vega", "mariano@gmail.com");
        const correo = new Correo(remitente, [destinatario], "   ", "texto");
        expect(correo.esValidoParaEnviar()).toBe(false);
        expect(correo.motivoInvalido()).toBe("El correo no tiene asunto");
    });

    it("un correo sin destinatarios no es válido para enviar", () => {
        const remitente = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
        const correo = new Correo(remitente, [], "Hola", "texto");
        expect(correo.esValidoParaEnviar()).toBe(false);
        expect(correo.motivoInvalido()).toBe("El correo no tiene destinatarios");
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
});