import { Correo } from "./Correo";
import { IConsultaBandejas } from "./IConsultaBandejas";
import { TipoBandeja } from "./TipoBandeja";

// RF-04: busca un texto en los correos de la Entrada.
// No distingue mayúsculas, acepta coincidencias parciales y mira todos los campos.
// No modifica nada: solo consulta.
//
// [SOLID · S] solo busca; los no leídos y los movimientos son de otras clases.
// [SOLID · D] depende del contrato IConsultaBandejas, no de GestorBandejas.

export class BuscadorCorreos {
    private bandejas: IConsultaBandejas;

    constructor(bandejas: IConsultaBandejas) {
        this.bandejas = bandejas;
    }

    buscar(texto: string): Correo[] {
        const buscado = texto.toLowerCase();

        return this.bandejas.obtener(TipoBandeja.ENTRADA)
            .filter(correo => this.textosDe(correo).some(t => t.toLowerCase().includes(buscado)));
    }

    // Junta en una lista todos los textos de un correo donde se puede buscar.
    private textosDe(correo: Correo): string[] {
        const personas = [correo.getRemitente(), ...correo.getDestinatarios()];

        return [
            correo.getAsunto(),
            correo.getCuerpo(),
            ...personas.flatMap(persona => [persona.getNombre(), persona.getEmail()])
        ];
    }
}
