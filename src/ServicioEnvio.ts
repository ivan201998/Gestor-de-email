import { Correo } from "./Correo";
import { IGestorBandejas } from "./IGestorBandejas";
import { TipoBandeja } from "./TipoBandeja";

// RF-02: envío SIMULADO de correos (no se conecta a ningún servidor).
// Antes de enviar comprueba que el correo sea válido.
// El correo enviado queda en ENVIADOS; si venía de BORRADORES, sale de esa bandeja.
//
// [SOLID · D] depende del contrato IGestorBandejas, no de la clase concreta GestorBandejas.

export class ServicioEnvio {
    private gestor: IGestorBandejas;

    constructor(gestor: IGestorBandejas) {
        this.gestor = gestor;
    }

    enviar(correo: Correo): void {
        const motivo = correo.motivoInvalido();

        if (motivo !== undefined) {
            throw new Error(motivo);
        }
        if (this.gestor.bandejaDe(correo.getId()) === TipoBandeja.BORRADORES) {
            this.gestor.mover(correo.getId(), TipoBandeja.ENVIADOS);   // sale de Borradores
        } else {
            this.gestor.agregar(correo, TipoBandeja.ENVIADOS);
        }
    }
}