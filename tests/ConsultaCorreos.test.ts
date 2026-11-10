import { describe, it, expect } from "vitest";
import { ConsultaCorreos } from "../src/ConsultaCorreos";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("ConsultaCorreos", () => {
    it("devuelve solo los correos no leídos de una bandeja", () => {
        const gestor = new GestorBandejas();
        const leido = new Correo(ivan, [mariano], "Ya lo leí", "texto");
        const nuevo = new Correo(ivan, [mariano], "Sin leer", "texto");
        leido.marcarLeido();
        gestor.agregar(leido, TipoBandeja.ENTRADA);
        gestor.agregar(nuevo, TipoBandeja.ENTRADA);

        const consulta = new ConsultaCorreos(gestor);

        expect(consulta.noLeidos(TipoBandeja.ENTRADA)).toEqual([nuevo]);
    });

    it("al marcar un correo como leído deja de aparecer en los no leídos", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        const consulta = new ConsultaCorreos(gestor);

        expect(consulta.noLeidos(TipoBandeja.ENTRADA)).toEqual([correo]);

        correo.marcarLeido();

        expect(consulta.noLeidos(TipoBandeja.ENTRADA)).toEqual([]);
    });
});
