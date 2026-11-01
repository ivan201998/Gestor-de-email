import { Contacto } from "./Contacto";

export class Correo {
    private static proximoId: number = 1;
    private id: string;
    private remitente: Contacto;
    private destinatarios: Contacto[];
    private asunto: string;
    private cuerpo: string;

    constructor(remitente: Contacto, destinatarios: Contacto[], asunto: string, cuerpo: string) {
        this.id = "C-" + Correo.proximoId;
        Correo.proximoId = Correo.proximoId + 1;
        this.remitente = remitente;
        this.destinatarios = [...destinatarios];
        this.asunto = asunto;
        this.cuerpo = cuerpo;
    }

    getId(): string {
        return this.id;
    }

    getRemitente(): Contacto {
        return this.remitente;
    }

    getDestinatarios(): Contacto[] {
        return [...this.destinatarios];
    }

    getAsunto(): string {
        return this.asunto;
    }

    getCuerpo(): string {
        return this.cuerpo;
    }
    
    esValidoParaEnviar(): boolean {
        return this.asunto.trim() !== "" && this.destinatarios.length > 0;
    }
}