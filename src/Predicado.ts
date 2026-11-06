import { Correo } from "./Correo";

// RF-05: un predicado es una función que recibe un correo y responde true o false.

export type Predicado = (correo: Correo) => boolean;

// Combinadores: arman un predicado nuevo a partir de otros (programación funcional).
export const y = (a: Predicado, b: Predicado): Predicado => (correo) => a(correo) && b(correo);
export const o = (a: Predicado, b: Predicado): Predicado => (correo) => a(correo) || b(correo);
export const no = (a: Predicado): Predicado => (correo) => !a(correo);

// Predicados básicos que se pueden reutilizar en cualquier filtro.
export const deRemitente = (email: string): Predicado =>
    (correo) => correo.getRemitente().getEmail() === email.toLowerCase();

export const paraDestinatario = (email: string): Predicado =>
    (correo) => correo.getDestinatarios().some(destinatario => destinatario.getEmail() === email.toLowerCase());

export const asuntoContiene = (texto: string): Predicado =>
    (correo) => correo.getAsunto().toLowerCase().includes(texto.toLowerCase());

export const cuerpoContiene = (texto: string): Predicado =>
    (correo) => correo.getCuerpo().toLowerCase().includes(texto.toLowerCase());

export const esFavorito: Predicado = (correo) => correo.esFavorito();
export const estaLeido: Predicado = (correo) => correo.estaLeido();