import { Correo } from "./Correo";

// RF-01 / RF-02: decide si un correo se puede enviar.
// [SOLID · S] Correo solo guarda sus datos; la regla de validación vive acá.

export class ValidadorCorreo {

    // Devuelve por qué el correo no se puede enviar, o undefined si está todo bien.
    motivoInvalido(correo: Correo): string | undefined {
        if (correo.getAsunto().trim() === "") {
            return "El correo no tiene asunto";
        }
        if (correo.getDestinatarios().length === 0) {
            return "El correo no tiene destinatarios";
        }
        return undefined;
    }

    esValido(correo: Correo): boolean {
        return this.motivoInvalido(correo) === undefined;
    }
}
