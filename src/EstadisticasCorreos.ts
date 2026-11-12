import { Correo } from "./Correo";
import { IConsultaBandejas } from "./IConsultaBandejas";
import { Predicado } from "./Predicado";
import { TipoBandeja } from "./TipoBandeja";

// RF-10: información resumida de una bandeja con programación funcional (map, filter y reduce).
// Solo consulta: no modifica ningún correo.
// [SOLID · D] depende del contrato IConsultaBandejas, no de GestorBandejas.

export class EstadisticasCorreos {
    private bandejas: IConsultaBandejas;

    constructor(bandejas: IConsultaBandejas) {
        this.bandejas = bandejas;
    }

    // map: de cada correo se queda solo con el asunto.
    asuntos(bandeja: TipoBandeja): string[] {
        return this.bandejas.obtener(bandeja).map(correo => correo.getAsunto());
    }

    // filter: se queda con los correos que cumplen la condición.
    filtrar(bandeja: TipoBandeja, condicion: Predicado): Correo[] {
        return this.bandejas.obtener(bandeja).filter(condicion);
    }

    // reduce: junta todos los correos en un solo número, sumando 1 por cada correo no leído.
    totalNoLeidos(bandeja: TipoBandeja): number {
        return this.bandejas.obtener(bandeja)
            .reduce((total, correo) => correo.estaLeido() ? total : total + 1, 0);
    }
}