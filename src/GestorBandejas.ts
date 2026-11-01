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

    mover(id: string, destino: TipoBandeja): void {

        const actual = this.exigirUbicacion(id);

        if (actual === destino) {
            throw new Error("El correo " + id + " ya está en " + destino);
        }

        if (!(actual === TipoBandeja.BORRADORES && destino === TipoBandeja.ENVIADOS)) {
            throw new Error("Movimiento no permitido: " + actual + " -> " + destino);
        }

        this.ubicacion.set(id, destino);

    }

    // Eliminación lógica: el correo pasa a ELIMINADOS y se recuerda su bandeja de origen.
    eliminar(id: string): void {

        const actual = this.exigirUbicacion(id);

        if (actual === TipoBandeja.ELIMINADOS) {
            throw new Error("El correo " + id + " ya está eliminado");
        }

        this.origen.set(id, actual);
        this.ubicacion.set(id, TipoBandeja.ELIMINADOS);

    }

    // Devuelve el correo eliminado a la bandeja de donde salió.
    restaurar(id: string): void {

        const actual = this.exigirUbicacion(id);

        if (actual !== TipoBandeja.ELIMINADOS) {
            throw new Error("El correo " + id + " no está en ELIMINADOS");
        }

        this.ubicacion.set(id, this.origen.get(id) as TipoBandeja);
        this.origen.delete(id);

    }

    private exigirUbicacion(id: string): TipoBandeja {

        const bandeja = this.ubicacion.get(id);

        if (bandeja === undefined) {
            throw new Error("No existe el correo " + id);
        }

        return bandeja;

    }
}