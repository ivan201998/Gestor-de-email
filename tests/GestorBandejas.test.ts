import { describe, it, expect } from 'vitest';
import { GestorBandejas } from '../src/GestorBandejas';
import { TipoBandeja } from '../src/TipoBandeja';
import { Correo } from '../src/Correo';
import { Contacto } from '../src/Contacto';

const ana = new Contacto("Ana", "ana@ucp.edu.ar");
const luis = new Contacto("Luis", "luis@gmail.com");


function nuevoCorreo(): Correo {
    return new Correo(ana, [luis], "Hola", "texto");
}

describe("GestorBandejas", () => {
    it("agrega un correo a una bandeja y lo consulta", () => {
        const g = new GestorBandejas();
        const c = nuevoCorreo();
        g.agregar(c, TipoBandeja.ENTRADA);

        expect(g.obtener(TipoBandeja.ENTRADA)).toEqual([c]);
        expect(g.obtener(TipoBandeja.ENVIADOS)).toEqual([]);
    });
    
    it("un correo está en una única bandeja: no se puede agregar dos veces", () => {
        const g = new GestorBandejas();
        const c = nuevoCorreo();
        g.agregar(c, TipoBandeja.ENTRADA);

        expect(() => g.agregar(c, TipoBandeja.BORRADORES)).toThrow();
    });

    it("mueve un borrador a ENVIADOS sin duplicarlo", () => {
        const g = new GestorBandejas();
        const c = nuevoCorreo();
        g.agregar(c, TipoBandeja.BORRADORES);

        g.mover(c.getId(), TipoBandeja.ENVIADOS);

        expect(g.cantidad(TipoBandeja.BORRADORES)).toBe(0);
        expect(g.cantidad(TipoBandeja.ENVIADOS)).toBe(1);
    });
    
});
