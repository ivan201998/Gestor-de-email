import { IConsultaBandejas } from './IConsultaBandejas';
import { IMovimientoBandejas } from './IMovimientoBandejas';

// Contrato completo del gestor: lectura + escritura.
// Lo usa quien necesita las dos cosas (ServicioEnvio pregunta dónde está un correo y lo guarda o lo mueve).
export interface IGestorBandejas extends IConsultaBandejas, IMovimientoBandejas {
}
