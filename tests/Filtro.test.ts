import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { Filtro } from "../src/Filtro";
import { RegistroFiltros } from "../src/RegistroFiltros";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { asuntoContiene, deRemitente, esFavorito, no, o, paraDestinatario, y } from "../src/Predicado";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");
const pepe = new Contacto("Pepe Gómez", "pepe@ucp.edu.ar");

describe("Filtro", () => {

});

describe("RegistroFiltros", () => {
    
});
