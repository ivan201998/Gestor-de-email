import { Correo } from "./Correo";
import { IConsultaBandejas } from "./IConsultaBandejas";
import { TipoBandeja } from "./TipoBandeja";

// RF-08: consulta el estado de lectura de los correos de una bandeja (solo lectura).
// [SOLID · S] solo consulta leídos; la búsqueda de texto es de BuscadorCorreos.
// [SOLID · D] depende del contrato IConsultaBandejas, no de GestorBandejas.

export class ConsultaCorreos {
    private bandejas: IConsultaBandejas;

    constructor(bandejas: IConsultaBandejas) {
        this.bandejas = bandejas;
    }

    // Los correos no leídos de una bandeja.
    noLeidos(bandeja: TipoBandeja): Correo[] {
        return this.bandejas.obtener(bandeja).filter(correo => !correo.estaLeido());
    }
}
