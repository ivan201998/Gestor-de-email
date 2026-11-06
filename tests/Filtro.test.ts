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
    it("aplica la condición y no modifica la lista ni los correos originales", () => {
        const deMariano = new Correo(mariano, [ivan], "Examen", "texto");
        const dePepe = new Correo(pepe, [ivan], "Aviso", "texto");
        const correos = [deMariano, dePepe];
        const filtro = new Filtro("De Mariano", deRemitente("mariano@gmail.com"));

        const resultado = filtro.aplicar(correos);

        expect(resultado).toEqual([deMariano]);
        expect(correos).toEqual([deMariano, dePepe]);   // la lista original queda igual
        expect(deMariano.getAsunto()).toBe("Examen");   // el correo original queda igual
    });

    it("combina condiciones con y, o, no", () => {
        const urgenteDeMariano = new Correo(mariano, [ivan], "Urgente", "texto");
        const avisoDeMariano = new Correo(mariano, [ivan], "Aviso", "texto");
        const urgenteDePepe = new Correo(pepe, [ivan], "Urgente", "texto");
        const todos = [urgenteDeMariano, avisoDeMariano, urgenteDePepe];

        const conY = new Filtro("y", y(deRemitente("mariano@gmail.com"), asuntoContiene("urgente")));
        const conO = new Filtro("o", o(deRemitente("mariano@gmail.com"), asuntoContiene("urgente")));
        const conNo = new Filtro("no", no(deRemitente("mariano@gmail.com")));

        expect(conY.aplicar(todos)).toEqual([urgenteDeMariano]);
        expect(conO.aplicar(todos)).toEqual([urgenteDeMariano, avisoDeMariano, urgenteDePepe]);
        expect(conNo.aplicar(todos)).toEqual([urgenteDePepe]);
    });
    
    it("un filtro sin nombre no es válido", () => {
        expect(() => new Filtro("  ", esFavorito)).toThrow();
    });

    it("el mismo filtro se aplica a distintas bandejas", () => {
        const gestor = new GestorBandejas();
        const recibido = new Correo(mariano, [ivan], "Examen", "texto");
        const enviado = new Correo(ivan, [mariano], "Examen final", "texto");
        gestor.agregar(recibido, TipoBandeja.ENTRADA);
        gestor.agregar(enviado, TipoBandeja.ENVIADOS);
        const filtro = new Filtro("Examen", asuntoContiene("examen"));

        expect(filtro.aplicar(gestor.obtener(TipoBandeja.ENTRADA))).toEqual([recibido]);
        expect(filtro.aplicar(gestor.obtener(TipoBandeja.ENVIADOS))).toEqual([enviado]);
     });

    it("los cambios en los correos se reflejan sin volver a guardar el filtro", () => {
        const correo = new Correo(mariano, [ivan], "Hola", "texto");
        const filtro = new Filtro("Favoritos", esFavorito);

        expect(filtro.aplicar([correo])).toEqual([]);

        correo.marcarFavorito();

        expect(filtro.aplicar([correo])).toEqual([correo]);
     });
});

describe("RegistroFiltros", () => {

});
