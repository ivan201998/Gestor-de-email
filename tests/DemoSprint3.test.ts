import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { GestorBandejas } from "../src/GestorBandejas";
import { GestorBorradores } from "../src/GestorBorradores";
import { ServicioEnvio } from "../src/ServicioEnvio";
import { EstadisticasCorreos } from "../src/EstadisticasCorreos";
import { TipoBandeja } from "../src/TipoBandeja";
import { asuntoContiene, deRemitente, y } from "../src/Predicado";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

// Carga 100 correos en la Entrada: pares de Mariano, impares de Pepe; múltiplos de 5 son urgentes.
function cargarCienCorreos(gestor: GestorBandejas): void {
    for (let i = 1; i <= 100; i++) {
        const remitente = i % 2 === 0 ? mariano : pepe;
        const asunto = i % 5 === 0 ? "Urgente " + i : "Aviso " + i;
        gestor.agregar(new Correo(remitente, [ivan], asunto, "texto"), TipoBandeja.ENTRADA);
    }
}

describe("Escenario del Sprint 3", () => {
    
});
