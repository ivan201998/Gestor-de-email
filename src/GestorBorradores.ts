import { Contacto } from "./Contacto";
import { Correo } from "./Correo";
import { IGestorBandejas } from "./IGestorBandejas";
import { TipoBandeja } from "./TipoBandeja";

// RF-07: gestión de borradores.
// Un borrador puede estar incompleto y se edita antes de enviarlo.
// [SOLID · S] solo maneja borradores; el envío es de ServicioEnvio.
// [SOLID · D] depende del contrato IGestorBandejas, no de GestorBandejas.

export class GestorBorradores {
    private gestor: IGestorBandejas;

    constructor(gestor: IGestorBandejas) {
        this.gestor = gestor;
    }

    // Empieza un borrador vacío y lo guarda en BORRADORES.
    crear(remitente: Contacto): Correo {
        const borrador = new Correo(remitente, [], "", "");
        this.gestor.agregar(borrador, TipoBandeja.BORRADORES);
        return borrador;
    }

    // Cambia los datos de un borrador. Solo se cambia lo que viene en "cambios".
    editar(id: string, cambios: { asunto?: string; cuerpo?: string; destinatarios?: Contacto[] }): void {
        const borrador = this.buscarBorrador(id);

        if (cambios.asunto !== undefined) {
            borrador.cambiarAsunto(cambios.asunto);
        }
        if (cambios.cuerpo !== undefined) {
            borrador.cambiarCuerpo(cambios.cuerpo);
        }
        if (cambios.destinatarios !== undefined) {
            borrador.cambiarDestinatarios(cambios.destinatarios);
        }
    }
    
    // Devuelve los borradores guardados, para retomarlos.
    listar(): Correo[] {
        return this.gestor.obtener(TipoBandeja.BORRADORES);
    }

    // Busca un borrador por id; si no está en BORRADORES tira un error.
    private buscarBorrador(id: string): Correo {
        const borrador = this.listar().find(correo => correo.getId() === id);

        if (borrador === undefined) {
            throw new Error("No existe un borrador con id " + id);
        }
        return borrador;
    }
}