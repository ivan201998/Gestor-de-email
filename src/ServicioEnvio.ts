import { Correo } from "./Correo";
import { GestorBandejas } from "./GestorBandejas";
import { TipoBandeja } from "./TipoBandeja";

export class ServicioEnvio {
    private gestor: GestorBandejas;

    constructor(gestor: GestorBandejas) {
        this.gestor = gestor;
    }

    enviar(correo: Correo): void {
        if (!correo.esValidoParaEnviar()) {
            throw new Error("El correo no es válido para enviar");
        }
        this.gestor.agregar(correo, TipoBandeja.ENVIADOS);
    }
}