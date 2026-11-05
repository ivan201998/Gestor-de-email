import { describe, it, expect } from "vitest";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

describe("ServicioEnvio", () => {
    it("un correo enviado queda en la bandeja de Enviados", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const correo = new Correo(ivan, [mariano], "Hola", "texto");

        servicio.enviar(correo);

        expect(gestor.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
    });

    it("no envía un correo inválido y no lo guarda en Enviados", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const correo = new Correo(ivan, [], "Hola", "texto");

        expect(() => servicio.enviar(correo)).toThrow();
        expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(0);
    });

    it("enviar dos veces el mismo correo no lo duplica en Enviados", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const correo = new Correo(ivan, [mariano], "Hola", "texto");

        servicio.enviar(correo);

        expect(() => servicio.enviar(correo)).toThrow();
        expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(1);
    });

    it("puede enviar un correo a varios destinatarios", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const correo = new Correo(ivan, [mariano, pepe], "Reunión", "texto");

        servicio.enviar(correo);

        const enviado = gestor.obtener(TipoBandeja.ENVIADOS)[0];
        expect(enviado.getDestinatarios()).toEqual([mariano, pepe]);
    });

    it("el error dice por qué no se puede enviar", () => {
        const servicio = new ServicioEnvio(new GestorBandejas());

        expect(() => servicio.enviar(new Correo(ivan, [mariano], "  ", "texto"))).toThrow("asunto");
        expect(() => servicio.enviar(new Correo(ivan, [], "Hola", "texto"))).toThrow("destinatarios");
    });

    it("un borrador enviado deja de estar en Borradores", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const correo = new Correo(ivan, [mariano], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.BORRADORES);

        servicio.enviar(correo);

        expect(gestor.cantidad(TipoBandeja.BORRADORES)).toBe(0);
        expect(gestor.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
    });

    it("un borrador inválido no se envía y sigue en Borradores", () => {
        const gestor = new GestorBandejas();
        const servicio = new ServicioEnvio(gestor);
        const borrador = new Correo(ivan, [], "Hola", "texto");
        gestor.agregar(borrador, TipoBandeja.BORRADORES);

        expect(() => servicio.enviar(borrador)).toThrow();
        expect(gestor.obtener(TipoBandeja.BORRADORES)).toEqual([borrador]);
        expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(0);
    });
        it("cada destinatario recibe su propia copia: si uno lo lee, para el otro sigue sin leer", () => {
        const buzonIvan = new GestorBandejas();
        const buzonMariano = new GestorBandejas();
        const buzonPepe = new GestorBandejas();
        const buzones = new Map([
            [mariano.getEmail(), buzonMariano],
            [pepe.getEmail(), buzonPepe]
        ]);
        const servicio = new ServicioEnvio(buzonIvan, buzones);

        servicio.enviar(new Correo(ivan, [mariano, pepe], "Hola", "texto"));

        const delMariano = buzonMariano.obtener(TipoBandeja.ENTRADA)[0];
        const dePepe = buzonPepe.obtener(TipoBandeja.ENTRADA)[0];

        delMariano.marcarLeido();

        expect(delMariano.estaLeido()).toBe(true);
        expect(dePepe.estaLeido()).toBe(false);
    });
});