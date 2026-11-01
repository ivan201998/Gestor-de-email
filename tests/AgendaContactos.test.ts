import { describe, it, expect } from 'vitest';
import { AgendaContactos } from '../src/AgendaContactos';
import { Contacto } from '../src/Contacto';
import { Correo } from '../src/Correo';

describe("AgendaContactos", () => {
    it("agrega y consulta un contacto", () => {
        const agenda = new AgendaContactos();
        const ana = new Contacto("Ana", "ana@ucp.edu.ar");
        agenda.agregar(ana);

        expect(agenda.cantidad()).toBe(1);
        expect(agenda.buscar("ana@ucp.edu.ar")).toBe(ana);
    });

    it("no permite contactos duplicados por email", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Ana", "ana@ucp.edu.ar"));

        expect(() => agenda.agregar(new Contacto("Otra Ana", "ANA@ucp.edu.ar"))).toThrow();
        expect(agenda.cantidad()).toBe(1);
    });

    it("modifica un contacto existente", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Ana", "ana@ucp.edu.ar"));

        agenda.modificar("ana@ucp.edu.ar", "Ana María", "anamaria@ucp.edu.ar");

        expect(agenda.buscar("anamaria@ucp.edu.ar")?.getNombre()).toBe("Ana María");
    });

    it("elimina un contacto", () => {
        const agenda = new AgendaContactos();
        agenda.agregar(new Contacto("Ana", "ana@ucp.edu.ar"));

        expect(agenda.eliminar("ana@ucp.edu.ar")).toBe(true);
        expect(agenda.cantidad()).toBe(0);
    });

    it("eliminar un contacto no elimina los correos históricos que lo referencian", () => {
        const agenda = new AgendaContactos();
        const ana = new Contacto("Ana", "ana@ucp.edu.ar");
        agenda.agregar(ana);
        const correo = new Correo(new Contacto("Luis", "luis@ucp.edu.ar"), "Hola", "texto", [ana]);

        agenda.eliminar("ana@ucp.edu.ar");

        expect(correo.getDestinatarios()[0].getEmail()).toBe("ana@ucp.edu.ar");
    });

});
