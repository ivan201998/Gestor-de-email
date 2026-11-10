import { Correo } from "./Correo";
import { IGestorBandejas } from "./IGestorBandejas";
import { TipoBandeja } from "./TipoBandeja";
import { ValidadorCorreo } from "./ValidadorCorreo";

// RF-02: envío SIMULADO de correos (no se conecta a ningún servidor).
// Antes de enviar le pregunta al validador si el correo es válido.
// El correo enviado queda en ENVIADOS; si venía de BORRADORES, sale de esa bandeja.
// Después entrega una copia en la Entrada de cada destinatario que tenga buzón.
//
// [SOLID · D] depende del contrato IGestorBandejas, no de la clase concreta GestorBandejas.

export class ServicioEnvio {
    private gestor: IGestorBandejas;
    private buzones: Map<string, IGestorBandejas>;
    private validador: ValidadorCorreo;

    constructor(
        gestor: IGestorBandejas,
        buzones: Map<string, IGestorBandejas> = new Map(),
        validador: ValidadorCorreo = new ValidadorCorreo()
    ) {
        this.gestor = gestor;
        this.buzones = buzones;
        this.validador = validador;
    }

    enviar(correo: Correo): void {
        const motivo = this.validador.motivoInvalido(correo);

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

    // Pone una copia del correo en la Entrada de cada destinatario que tenga buzón.
    private entregar(correo: Correo): void {
        correo.getDestinatarios()
            .map(destinatario => this.buzones.get(destinatario.getEmail()))
            .filter(buzon => buzon !== undefined)
            .forEach(buzon => buzon!.agregar(correo.copiar(), TipoBandeja.ENTRADA));
    }
}
