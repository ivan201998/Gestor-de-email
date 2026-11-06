import { Contacto } from "./Contacto";

// RF-01: un correo electrónico.
// Tiene identidad (id único), remitente, destinatarios, asunto y cuerpo,
// y un estado de lectura y de favorito que empiezan en falso.

export class Correo {
    private static proximoId: number = 1;
    private readonly id: string;
    private remitente: Contacto;
    private destinatarios: Contacto[];
    private asunto: string;
    private cuerpo: string;
    private leido: boolean = false;
    private favorito: boolean = false;

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
    
    // Devuelve por qué el correo no se puede enviar, o undefined si está todo bien.
    motivoInvalido(): string | undefined {
        if (this.asunto.trim() === "") {
            return "El correo no tiene asunto";
        }
        if (this.destinatarios.length === 0) {
            return "El correo no tiene destinatarios";
        }
        return undefined;
    }

    esValidoParaEnviar(): boolean {
        return this.motivoInvalido() === undefined;
    }

    estaLeido(): boolean {
        return this.leido;
    }
        marcarLeido(): void {
        this.leido = true;
    }

    marcarNoLeido(): void {
        this.leido = false;
    }

    esFavorito(): boolean {
        return this.favorito;
    }
    
    // Crea un correo nuevo con los mismos datos (remitente, destinatarios, asunto y cuerpo).
    // La copia tiene su propio id y empieza como no leída y no favorita.
    copiar(): Correo {
        return new Correo(this.remitente, this.destinatarios, this.asunto, this.cuerpo);
    }

    marcarFavorito(): void {
        this.favorito = true;
    }

    desmarcarFavorito(): void {
        this.favorito = false;
    }
}