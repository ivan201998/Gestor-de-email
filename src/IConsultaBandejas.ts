import { Correo } from './Correo';
import { TipoBandeja } from './TipoBandeja';

// Contrato de SOLO LECTURA sobre las bandejas.
// Pensado para quien solo necesite mirar los correos (más adelante: búsqueda, filtros y estadísticas):
// puede consultar las bandejas, pero no mover ni borrar nada.
// [SOLID · I] contrato chico, solo con consultas.
// [SOLID · D] quien consulta depende de este contrato y no de la clase GestorBandejas.
export interface IConsultaBandejas {
    obtener(bandeja: TipoBandeja): Correo[];
    cantidad(bandeja: TipoBandeja): number;
    bandejaDe(id: string): TipoBandeja | undefined;
}
