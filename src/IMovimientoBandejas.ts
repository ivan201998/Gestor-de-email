import { Correo } from './Correo';
import { TipoBandeja } from './TipoBandeja';

// Contrato de ESCRITURA sobre las bandejas: guardar, mover, eliminar y restaurar correos.
// [SOLID · I] separado de IConsultaBandejas: quien solo lee no necesita estos métodos.
export interface IMovimientoBandejas {
    agregar(correo: Correo, bandeja: TipoBandeja): void;
    mover(id: string, destino: TipoBandeja): void;
    eliminar(id: string): void;
    restaurar(id: string): void;
}
