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
        it("busca en el asunto sin importar mayúsculas y con coincidencia parcial", () => {
        const gestor = new GestorBandejas();
        const examen = new Correo(ivan, [mariano], "Fecha del EXAMEN final", "texto");
        const otro = new Correo(ivan, [mariano], "Reunión", "texto");
        gestor.agregar(examen, TipoBandeja.ENTRADA);
        gestor.agregar(otro, TipoBandeja.ENTRADA);
        const consulta = new ConsultaCorreos(gestor);

        expect(consulta.buscar("exam")).toEqual([examen]);
    });
        it("busca también en el cuerpo, el remitente y los destinatarios", () => {
        const gestor = new GestorBandejas();
        const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");
        const correo = new Correo(ivan, [mariano, pepe], "Hola", "Traer la carpeta");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        const consulta = new ConsultaCorreos(gestor);

        expect(consulta.buscar("carpeta")).toEqual([correo]);      // cuerpo
        expect(consulta.buscar("cabrera")).toEqual([correo]);      // nombre del remitente
        expect(consulta.buscar("ivan@ucp")).toEqual([correo]);     // email del remitente
        expect(consulta.buscar("gómez")).toEqual([correo]);        // nombre de un destinatario
        expect(consulta.buscar("mariano@gmail")).toEqual([correo]); // email de un destinatario
    });
        it("un correo aparece una sola vez aunque coincida en varios campos", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Ivan avisa", "Saludos de Ivan");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        expect(new ConsultaCorreos(gestor).buscar("ivan")).toEqual([correo]);
    });

    it("devuelve una lista vacía si no hay coincidencias o la bandeja está vacía", () => {
        const vacio = new GestorBandejas();
        expect(new ConsultaCorreos(vacio).buscar("hola")).toEqual([]);

        const gestor = new GestorBandejas();
        gestor.agregar(new Correo(ivan, [mariano], "Hola", "texto"), TipoBandeja.ENTRADA);
        expect(new ConsultaCorreos(gestor).buscar("examen")).toEqual([]);
    });

    it("buscar no modifica los correos", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "Ivan avisa", "Saludos de Ivan");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        const consulta = new ConsultaCorreos(gestor);

        const correosAntes = [...consulta.buscar("ivan")];
        const correosDespues = [...consulta.buscar("ivan")];

        expect(correosAntes).toEqual(correosDespues);
    });
});