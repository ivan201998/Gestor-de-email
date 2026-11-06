import { describe, it, expect } from "vitest";
import { Contacto } from "../src/Contacto";
import { Correo } from "../src/Correo";
import { Filtro } from "../src/Filtro";
import { GestorBandejas } from "../src/GestorBandejas";
import { TipoBandeja } from "../src/TipoBandeja";
import { VistaFavoritos } from "../src/VistaFavoritos";
import { asuntoContiene } from "../src/Predicado";

const ivan = new Contacto("Ivan Cabrera", "ivan@ucp.edu.ar");
const mariano = new Contacto("Mariano Vega", "mariano@gmail.com");

describe("Favoritos", () => {
    it("se puede marcar y desmarcar un correo como favorito", () => {
        const correo = new Correo(mariano, [ivan], "Hola", "texto");

        correo.marcarFavorito();
        expect(correo.esFavorito()).toBe(true);

        correo.desmarcarFavorito();
        expect(correo.esFavorito()).toBe(false);
    });

    it("la vista junta los favoritos de todas las bandejas sin duplicados", () => {
        const gestor = new GestorBandejas();
        const recibido = new Correo(mariano, [ivan], "Recibido", "texto");
        const enviado = new Correo(ivan, [mariano], "Enviado", "texto");
        const comun = new Correo(mariano, [ivan], "Común", "texto");
        gestor.agregar(recibido, TipoBandeja.ENTRADA);
        gestor.agregar(enviado, TipoBandeja.ENVIADOS);
        gestor.agregar(comun, TipoBandeja.ENTRADA);
        recibido.marcarFavorito();
        enviado.marcarFavorito();

        const favoritos = new VistaFavoritos(gestor).obtener();

        expect(favoritos).toEqual([recibido, enviado]);
    });

    it("marcar como favorito no mueve el correo de su bandeja", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(mariano, [ivan], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.ENTRADA);

        correo.marcarFavorito();

        expect(gestor.bandejaDe(correo.getId())).toBe(TipoBandeja.ENTRADA);
        expect(gestor.cantidad(TipoBandeja.ENTRADA)).toBe(1);
    });

    it("un favorito eliminado no aparece en la vista y vuelve con su marca al restaurarlo", () => {
        const gestor = new GestorBandejas();
        const correo = new Correo(mariano, [ivan], "Hola", "texto");
        gestor.agregar(correo, TipoBandeja.ENTRADA);
        correo.marcarFavorito();
        const vista = new VistaFavoritos(gestor);

        gestor.eliminar(correo.getId());
        expect(vista.obtener()).toEqual([]);
        expect(correo.esFavorito()).toBe(true);

        gestor.restaurar(correo.getId());
        expect(vista.obtener()).toEqual([correo]);
    });

    it("la vista se puede combinar con un filtro", () => {
        const gestor = new GestorBandejas();
        const examen = new Correo(mariano, [ivan], "Examen", "texto");
        const aviso = new Correo(mariano, [ivan], "Aviso", "texto");
        gestor.agregar(examen, TipoBandeja.ENTRADA);
        gestor.agregar(aviso, TipoBandeja.ENTRADA);
        examen.marcarFavorito();
        aviso.marcarFavorito();

        const resultado = new VistaFavoritos(gestor).obtenerFiltrados(new Filtro("Examen", asuntoContiene("examen")));

        expect(resultado).toEqual([examen]);
    });
});
