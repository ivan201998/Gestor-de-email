import { describe, it, expect } from 'vitest';
import { AgendaContactos } from '../src/AgendaContactos';
import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

describe("AgendaContactos", () => {
    it("agrega y consulta un contacto", () => {
        const agenda = new AgendaContactos();
        const victoria = new Contacto("Victoria", "victoria@ucp.edu.ar");
        agenda.agregar(victoria);

        expect(agenda.cantidad()).toBe(1);
        expect(agenda.buscar("victoria@ucp.edu.ar")).toBe(victoria);
    });

    it("no permite contactos duplicados por email", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Victoria", "victoria@ucp.edu.ar"));

        expect(() => agenda.agregar(new Contacto("Otra Victoria", "VICTORIA@ucp.edu.ar"))).toThrow();
        expect(agenda.cantidad()).toBe(1);
    });

    it("modifica un contacto existente", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Victoria", "victoria@ucp.edu.ar"));

        agenda.modificar("victoria@ucp.edu.ar", "Victoria Ruiz", "victoriaruiz@ucp.edu.ar");

        expect(agenda.buscar("victoriaruiz@ucp.edu.ar")?.getNombre()).toBe("Victoria Ruiz");
    });

    it("elimina un contacto", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Victoria", "victoria@ucp.edu.ar"));

        expect(agenda.eliminar("victoria@ucp.edu.ar")).toBe(true);
        expect(agenda.cantidad()).toBe(0);
    });

    it("eliminar un contacto no elimina los correos históricos que lo referencian", () => {
        const agenda = new AgendaContactos();
        const victoria = new Contacto("Victoria", "victoria@ucp.edu.ar");
        agenda.agregar(victoria);
        const correo = new Correo(new Contacto("Manuel", "manuel@ucp.edu.ar"), [victoria], "Hola", "texto");

        agenda.eliminar("victoria@ucp.edu.ar");

        expect(correo.getDestinatarios()[0].getEmail()).toBe("victoria@ucp.edu.ar");
    });

});
