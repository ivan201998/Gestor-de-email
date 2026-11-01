import { Correo } from './Correo';
import { TipoBandeja } from './TipoBandeja';

// RF-06: administra las cuatro bandejas.

export class GestorBandejas {
    private correos: Correo[] = [];
    private ubicacion: Map<string, TipoBandeja> = new Map();
    private origen: Map<string, TipoBandeja> = new Map(); // de dónde vino un correo eliminado

    // Incorpora un correo nuevo a una bandeja (ej: un recibido va a ENTRADA, un borrador a BORRADORES).
    agregar(correo: Correo, bandeja: TipoBandeja): void {

        if (this.ubicacion.has(correo.getId())) {
            throw new Error("El correo " + correo.getId() + " ya está en la bandeja " + this.ubicacion.get(correo.getId()));
        }

        if (bandeja === TipoBandeja.ELIMINADOS) {
            throw new Error("Un correo nuevo no puede agregarse directamente a ELIMINADOS");
        }

        this.correos.push(correo);
        this.ubicacion.set(correo.getId(), bandeja);

    }

    // Devuelve en qué bandeja está el correo, o undefined si el gestor no lo conoce.
    bandejaDe(id: string): TipoBandeja | undefined {

        return this.ubicacion.get(id);

    }

    // Devuelve una COPIA de los correos de una bandeja.
    obtener(bandeja: TipoBandeja): Correo[] {

        return this.correos.filter(correo => this.ubicacion.get(correo.getId()) === bandeja);

    }

    cantidad(bandeja: TipoBandeja): number {

        return this.obtener(bandeja).length;

    }

    
}