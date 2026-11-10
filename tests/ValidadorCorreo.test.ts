import { describe, it, expect } from "vitest";
import { ValidadorCorreo } from "../src/ValidadorCorreo";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("ValidadorCorreo", () => {
    it("un correo con asunto y destinatario es válido para enviar", () => {
        const correo = new Correo(ivan, [mariano], "Hola", "texto");

        expect(new ValidadorCorreo().esValido(correo)).toBe(true);
        expect(new ValidadorCorreo().motivoInvalido(correo)).toBeUndefined();
    });

    it("un correo sin asunto no es válido y dice el motivo", () => {
        const correo = new Correo(ivan, [mariano], "   ", "texto");

        expect(new ValidadorCorreo().esValido(correo)).toBe(false);
        expect(new ValidadorCorreo().motivoInvalido(correo)).toBe("El correo no tiene asunto");
    });

    it("un correo sin destinatarios no es válido y dice el motivo", () => {
        const correo = new Correo(ivan, [], "Hola", "texto");

        expect(new ValidadorCorreo().esValido(correo)).toBe(false);
        expect(new ValidadorCorreo().motivoInvalido(correo)).toBe("El correo no tiene destinatarios");
    });
});
