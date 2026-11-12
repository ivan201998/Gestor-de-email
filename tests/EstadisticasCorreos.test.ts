import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { EstadisticasCorreos } from "../src/EstadisticasCorreos";
import { GestorBandejas } from "../src/GestorBandejas";
import { asuntoContiene } from "../src/Predicado";
import { TipoBandeja } from "../src/TipoBandeja";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

// Una Entrada con 3 correos: dos de Mariano y uno de Pepe.
function entradaConTresCorreos(): GestorBandejas {
    const gestor = new GestorBandejas();
    gestor.agregar(new Correo(mariano, [ivan], "Examen de Paradigmas", "El martes"), TipoBandeja.ENTRADA);
    gestor.agregar(new Correo(pepe, [ivan], "Reunión de grupo", "A las 18"), TipoBandeja.ENTRADA);
    gestor.agregar(new Correo(mariano, [ivan], "Urgente: entrega del TP", "Antes del viernes"), TipoBandeja.ENTRADA);
    return gestor;
}

describe("EstadisticasCorreos (RF-10)", () => {
    it("map: devuelve la lista de asuntos de una bandeja", () => {

    });

    it("map: una bandeja vacía devuelve una lista vacía", () => {

    });

    it("filter: devuelve solo los correos que cumplen la condición", () => {

    });

      it("reduce: cuenta cuántos correos hay de cada remitente", () => {
        
      });
});