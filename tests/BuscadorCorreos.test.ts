import { describe, it, expect } from "vitest";
import { BuscadorCorreos } from "../src/BuscadorCorreos";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("BuscadorCorreos", () => {
    it("busca en el asunto sin importar mayúsculas y con coincidencia parcial", () => {
        const gestor = new GestorBandejas();
        const examen = new Correo(ivan, [mariano], "Fecha del EXAMEN final", "texto");
        const otro = new Correo(ivan, [mariano], "Reunión", "texto");
        gestor.agregar(examen, TipoBandeja.ENTRADA);
        gestor.agregar(otro, TipoBandeja.ENTRADA);

        expect(new BuscadorCorreos(gestor).buscar("exam")).toEqual([examen]);
    });

    it("busca también en el cuerpo, el remitente y los destinatarios", () => {
        const gestor = new GestorBandejas();
        const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");
        const correo = new Correo(ivan, [mariano, pepe], "Hola", "Traer la carpeta");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        const buscador = new BuscadorCorreos(gestor);

        expect(buscador.buscar("carpeta")).toEqual([correo]);       // cuerpo
        expect(buscador.buscar("cabrera")).toEqual([correo]);       // nombre del remitente
        expect(buscador.buscar("ivan@ucp")).toEqual([correo]);      // email del remitente
        expect(buscador.buscar("gómez")).toEqual([correo]);         // nombre de un destinatario
        expect(buscador.buscar("mariano@gmail")).toEqual([correo]); // email de un destinatario
    });

    it("un correo aparece una sola vez aunque coincida en varios campos", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Ivan avisa", "Saludos de Ivan");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        expect(new BuscadorCorreos(gestor).buscar("ivan")).toEqual([correo]);
    });

    it("devuelve una lista vacía si no hay coincidencias o la bandeja está vacía", () => {
        expect(new BuscadorCorreos(new GestorBandejas()).buscar("hola")).toEqual([]);

        const gestor = new GestorBandejas();
        gestor.agregar(new Correo(ivan, [mariano], "Hola", "texto"), TipoBandeja.ENTRADA);
        expect(new BuscadorCorreos(gestor).buscar("examen")).toEqual([]);
    });

    it("buscar no modifica los correos ni la bandeja", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Ivan avisa", "Saludos de Ivan");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        new BuscadorCorreos(gestor).buscar("ivan");

        expect(correo.getAsunto()).toBe("Ivan avisa");
        expect(correo.getCuerpo()).toBe("Saludos de Ivan");
        expect(gestor.obtener(TipoBandeja.ENTRADA)).toEqual([correo]);
    });
});
