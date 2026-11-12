import { describe, it, expect } from "vitest";
import { GestorBorradores } from "../src/GestorBorradores";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");

describe("GestorBorradores", () => {
    it("al empezar a redactar se registra un borrador vacío en Borradores", () => {
        const gestor = new GestorBandejas();
        const borradores = new GestorBorradores(gestor);

        const borrador = borradores.crear(ivan);

        expect(gestor.obtener(TipoBandeja.BORRADORES)).toEqual([borrador]);
        expect(borrador.getAsunto()).toBe("");
        expect(borrador.getDestinatarios()).toEqual([]);
    });
    it("los cambios de la edición se conservan en el borrador", () => {
        const gestor = new GestorBandejas();
        const borradores = new GestorBorradores(gestor);
        const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
        const borrador = borradores.crear(ivan);

        borradores.editar(borrador.getId(), { asunto: "Reunión", cuerpo: "El martes a las 10", destinatarios: [mariano] });

        const guardado = gestor.obtener(TipoBandeja.BORRADORES)[0];
        expect(guardado.getAsunto()).toBe("Reunión");
        expect(guardado.getCuerpo()).toBe("El martes a las 10");
        expect(guardado.getDestinatarios()).toEqual([mariano]);
    });
    it("se pueden recuperar los borradores guardados y seguir editándolos", () => {
        const gestor = new GestorBandejas();
        const borradores = new GestorBorradores(gestor);
        const primero = borradores.crear(ivan);
        const segundo = borradores.crear(ivan);

        const recuperados = borradores.listar();
        expect(recuperados).toEqual([primero, segundo]);

        borradores.editar(recuperados[1].getId(), { asunto: "Retomado" });

        expect(segundo.getAsunto()).toBe("Retomado");
        expect(segundo.getCuerpo()).toBe("");   // lo que no se editó queda igual
    });
    it("no se puede editar un correo que no está en Borradores", () => {
        const gestor = new GestorBandejas();
        const borradores = new GestorBorradores(gestor);
        const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
        const enviado = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(enviado, TipoBandeja.ENVIADOS);

        expect(() => borradores.editar(enviado.getId(), { asunto: "Cambiado" })).toThrow();
        expect(enviado.getAsunto()).toBe("Hola");
    });
});