import { Correo } from "./Correo";
import { IConsultaBandejas } from "./IConsultaBandejas";
import { TipoBandeja } from "./TipoBandeja";

// Consultas sobre los correos de las bandejas (solo lectura).
// [SOLID · S] solo consulta; mover y borrar es responsabilidad del gestor.
// [SOLID · D] depende del contrato IConsultaBandejas, no de GestorBandejas.

export class ConsultaCorreos {
    private bandejas: IConsultaBandejas;

    constructor(bandejas: IConsultaBandejas) {
        this.bandejas = bandejas;
    }

    // RF-08: los correos no leídos de una bandeja.
    noLeidos(bandeja: TipoBandeja): Correo[] {
        return this.bandejas.obtener(bandeja).filter(correo => !correo.estaLeido());
    }
}