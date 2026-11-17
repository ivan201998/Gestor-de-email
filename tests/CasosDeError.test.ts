import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { AgendaContactos } from "../src/AgendaContactos";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("Casos de error: GestorBandejas", () => {
    it("no deja mover un correo a la bandeja donde ya está", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.BORRADORES);

        expect(() => gestor.mover(correo.getId(), TipoBandeja.BORRADORES)).toThrow();
    });

    it("no deja eliminar dos veces el mismo correo", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        gestor.eliminar(correo.getId());

        expect(() => gestor.eliminar(correo.getId())).toThrow();
    });

    it("no deja restaurar un correo que no está en Eliminados", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        expect(() => gestor.restaurar(correo.getId())).toThrow();
    });

    it("da error con un id que no existe", () => {
        const gestor = new GestorBandejas();

        expect(() => gestor.eliminar("C-999999")).toThrow();
    });
});

describe("Casos de error: AgendaContactos", () => {
    it("no deja modificar un contacto que no existe", () => {
        const agenda = new AgendaContactos();

        expect(() => agenda.modificar("nadie@ucp.edu.ar", "Nadie", "nadie@ucp.edu.ar")).toThrow();
    });

    it("no deja cambiar el email por uno que ya usa otro contacto", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar"));
        agenda.agregar(new Contacto("Mariano Vega", "mariano@gmail.com"));

        expect(() => agenda.modificar("ivan@ucp.edu.ar", "Ivan Cabrera", "mariano@gmail.com")).toThrow();
    });
});