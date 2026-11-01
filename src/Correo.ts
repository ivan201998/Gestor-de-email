import { Contacto } from "./Contacto";

export class Correo {

    private remitente: Contacto;
    private destinatarios: Contacto[];
    private asunto: string;
    private cuerpo: string;

    constructor(remitente: Contacto, destinatarios: Contacto[], asunto: string, cuerpo: string) {
        this.remitente = remitente;
        this.destinatarios = destinatarios;
        this.asunto = asunto;
        this.cuerpo = cuerpo;
    }

    getRemitente(): Contacto {
        return this.remitente;
    }

    getDestinatarios(): Contacto[] {
        return this.destinatarios;
    }

    getAsunto(): string {
        return this.asunto;
    }

    getCuerpo(): string {
        return this.cuerpo;
    }
}