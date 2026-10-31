import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/Contacto';

describe("Contacto", () => {  
    it("guarda el nombre y el email", () => {
        const contacto = new Contacto("Ana López", "ana@ucp.edu.ar");
        expect(contacto.nombre).toBe("Ana López");
        expect(contacto.email).toBe("ana@ucp.edu.ar");
  });

    it("rechaza un email con formato inválido", () => {
        expect(() => new Contacto("Ana", "ana.ucp.edu.ar")).toThrow();
    });

    it("rechaza un nombre vacío", () => {
        expect(() => new Contacto("  ", "ana@ucp.edu.ar")).toThrow();
    });
});

