import { Contacto } from './Contacto';

// RF-03: agenda de contactos (alta, consulta, modificación y baja).

export class AgendaContactos {
    private contactos: Contacto[] = [];

    agregar(contacto: Contacto): void {

        if (this.existe(contacto.getEmail())) {
            throw new Error("Ya existe un contacto con el email " + contacto.getEmail());
        }

        this.contactos.push(contacto);

    }

    // Devuelve el contacto o undefined si no existe.
    buscar(email: string): Contacto | undefined {

        const buscado = email.trim().toLowerCase();

        return this.contactos.find(contacto => contacto.getEmail() === buscado);

    }

    existe(email: string): boolean {

        return this.buscar(email) !== undefined;

    }

    
}