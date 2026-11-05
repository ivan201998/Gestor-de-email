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
    private buzones: Map<string, IGestorBandejas>;

    constructor(gestor: IGestorBandejas, buzones: Map<string, IGestorBandejas> = new Map()) {
        this.gestor = gestor;
        this.buzones = buzones;
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
        this.entregar(correo);
    }
        // Pone el correo en la Entrada de cada destinatario que tenga buzón.
    private entregar(correo: Correo): void {
        correo.getDestinatarios()
            .map(destinatario => this.buzones.get(destinatario.getEmail()))
            .filter(buzon => buzon !== undefined)
            .forEach(buzon => buzon!.agregar(correo.copiar(), TipoBandeja.ENTRADA));
    }
}