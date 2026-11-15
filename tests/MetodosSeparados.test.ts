import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { GestorBorradores } from "../src/GestorBorradores";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { AgendaContactos } from "../src/AgendaContactos";
import { RegistroFiltros } from "../src/RegistroFiltros";
import { TipoBandeja } from "../src/TipoBandeja";

// Estos tests aseguran que, después de separar los métodos en partes más chicas,
// las clases siguen dando los mismos resultados y los mismos mensajes de error.

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("Métodos separados: envío, borradores, agenda y filtros siguen funcionando igual", () => {
    it("ServicioEnvio: un correo válido queda en Enviados y llega a la Entrada del destinatario", () => {
        const gestorIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const servicio = new ServicioEnvio(gestorIvan, new Map([[mariano.getEmail(), buzonMariano]]));

        servicio.enviar(new Correo(ivan, [mariano], "Hola", "texto"));

        expect(gestorIvan.cantidad(TipoBandeja.ENVIADOS)).toBe(1);
        expect(buzonMariano.cantidad(TipoBandeja.ENTRADA)).toBe(1);
    });

    it("ServicioEnvio: un correo inválido no se guarda ni se entrega", () => {
        const gestorIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const servicio = new ServicioEnvio(gestorIvan, new Map([[mariano.getEmail(), buzonMariano]]));

        expect(() => servicio.enviar(new Correo(ivan, [mariano], "", "texto"))).toThrow("El correo no tiene asunto");
        expect(gestorIvan.cantidad(TipoBandeja.ENVIADOS)).toBe(0);
        expect(buzonMariano.cantidad(TipoBandeja.ENTRADA)).toBe(0);
    });

    it("GestorBorradores: no se puede editar un borrador que no existe", () => {
        const borradores = new GestorBorradores(new GestorBandejas());

        expect(() => borradores.editar("C-999", { asunto: "Hola" })).toThrow();
    });
    
    it("AgendaContactos: modificar un contacto que no existe da el mismo mensaje", () => {
        const agenda = new AgendaContactos();

        expect(() => agenda.modificar("nadie@ucp.edu.ar", "Nadie", "nadie@ucp.edu.ar"))
            .toThrow("No existe un contacto con el email nadie@ucp.edu.ar");
    });

    it("RegistroFiltros: aplicar un filtro que no existe da el mismo mensaje", () => {
        const registro = new RegistroFiltros();

        expect(() => registro.aplicar("Inexistente", [])).toThrow("No existe el filtro Inexistente");
    });
});
