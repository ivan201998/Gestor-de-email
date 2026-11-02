import { describe, it, expect } from "vitest";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { Correo } from "../src/Correo";
import { Contacto } from "../src/Contacto";

const ana = new Contacto("Ana López", "ana@ucp.edu.ar");
const juan = new Contacto("Juan Pérez", "juan@gmail.com");
const luis = new Contacto("Luis Gómez", "luis@ucp.edu.ar");

describe("ServicioEnvio", () => {
  it("un correo enviado queda en la bandeja de Enviados", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const correo = new Correo(ana, [juan], "Hola", "texto");

    servicio.enviar(correo);

    expect(gestor.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
  });
    it("no envía un correo inválido y no lo guarda en Enviados", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const correo = new Correo(ana, [], "Hola", "texto");

    expect(() => servicio.enviar(correo)).toThrow();
    expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(0);
  });
    it("enviar dos veces el mismo correo no lo duplica en Enviados", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const correo = new Correo(ana, [juan], "Hola", "texto");

    servicio.enviar(correo);

    expect(() => servicio.enviar(correo)).toThrow();
    expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(1);
  });
    it("puede enviar un correo a varios destinatarios", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const correo = new Correo(ana, [juan, luis], "Reunión", "texto");

    servicio.enviar(correo);

    const enviado = gestor.obtener(TipoBandeja.ENVIADOS)[0];
    expect(enviado.getDestinatarios()).toEqual([juan, luis]);
  });
    it("el error dice por qué no se puede enviar", () => {
    const servicio = new ServicioEnvio(new GestorBandejas());

    expect(() => servicio.enviar(new Correo(ana, [juan], "  ", "texto"))).toThrow("asunto");
    expect(() => servicio.enviar(new Correo(ana, [], "Hola", "texto"))).toThrow("destinatarios");
  });
    it("un borrador enviado deja de estar en Borradores", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const correo = new Correo(ana, [juan], "Hola", "texto");
    gestor.agregar(correo, TipoBandeja.BORRADORES);

    servicio.enviar(correo);

    expect(gestor.cantidad(TipoBandeja.BORRADORES)).toBe(0);
    expect(gestor.obtener(TipoBandeja.ENVIADOS)).toEqual([correo]);
  });
    it("un borrador inválido no se envía y sigue en Borradores", () => {
    const gestor = new GestorBandejas();
    const servicio = new ServicioEnvio(gestor);
    const borrador = new Correo(ana, [], "Hola", "texto");
    gestor.agregar(borrador, TipoBandeja.BORRADORES);

    expect(() => servicio.enviar(borrador)).toThrow();
    expect(gestor.obtener(TipoBandeja.BORRADORES)).toEqual([borrador]);
    expect(gestor.cantidad(TipoBandeja.ENVIADOS)).toBe(0);
  });
});