import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto';

describe("Contacto", () => {  
    it("guarda el nombre y el email", () => {
        const contacto = new Contacto("Lucas Fernández", "lucas@ucp.edu.ar");
        expect(contacto.getNombre()).toBe("Lucas Fernández");
        expect(contacto.getEmail()).toBe("lucas@ucp.edu.ar");
  });

    it("rechaza un email con formato inválido", () => {
        expect(() => new Contacto("Lucas", "lucas.ucp.edu.ar")).toThrow();
    });

    it("rechaza un nombre vacío", () => {
        expect(() => new Contacto("  ", "lucas@ucp.edu.ar")).toThrow();
    });
});

