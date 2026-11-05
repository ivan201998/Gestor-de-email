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

    // RF-04: busca un texto en los correos de la Entrada.
    // No distingue mayúsculas y acepta coincidencias parciales.
// RF-04: busca un texto en los correos de la Entrada.
    // No distingue mayúsculas, acepta coincidencias parciales y mira todos los campos.
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