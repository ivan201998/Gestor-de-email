import { Correo } from "./Correo";
import { Filtro } from "./Filtro";
import { IConsultaBandejas } from "./IConsultaBandejas";
import { TipoBandeja } from "./TipoBandeja";

// RF-09: vista de los correos favoritos de todas las bandejas.

// [SOLID · D] depende del contrato de solo lectura IConsultaBandejas.

export class VistaFavoritos {
    private consulta: IConsultaBandejas;

    constructor(consulta: IConsultaBandejas) {
        this.consulta = consulta;
    }

    obtener(): Correo[] {
        return Object.values(TipoBandeja)
            .filter(bandeja => bandeja !== TipoBandeja.ELIMINADOS)
            .flatMap(bandeja => this.consulta.obtener(bandeja))
            .filter(correo => correo.esFavorito());
    }

    // Combina la vista con un filtro (RF-05).
    obtenerFiltrados(filtro: Filtro): Correo[] {
        return filtro.aplicar(this.obtener());
    }
}
