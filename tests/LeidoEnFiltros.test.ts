import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { Filtro } from "../src/Filtro";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { y, no, estaLeido, cuerpoContiene } from "../src/Predicado";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("Leído y filtros (RF-08)", () => {
    it("al marcar un correo como leído sale del filtro de pendientes, y vuelve al marcarlo no leído", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(ivan, [mariano], "TP", "Recordatorio: Entrega el viernes");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        const pendientes = new Filtro("Pendientes de revisión", y(no(estaLeido), cuerpoContiene("entrega")));

        expect(pendientes.aplicar(gestor.obtener(TipoBandeja.ENTRADA))).toEqual([correo]);

        correo.marcarLeido();
        expect(pendientes.aplicar(gestor.obtener(TipoBandeja.ENTRADA))).toEqual([]);

        correo.marcarNoLeido();
        expect(pendientes.aplicar(gestor.obtener(TipoBandeja.ENTRADA))).toEqual([correo]);
    });
});