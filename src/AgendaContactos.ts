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

    // Devuelve una COPIA de la lista: desde afuera no se puede agregar ni sacar contactos sin pasar por la agenda.
    listar(): Contacto[] {

        return [...this.contactos];

    }

    cantidad(): number {

        return this.contactos.length;

    }

    // Cambia nombre y/o email de un contacto. Si el nuevo email ya lo usa otro contacto, lo rechaza.
    modificar(emailActual: string, nuevoNombre: string, nuevoEmail: string): void {

        const contacto = this.buscar(emailActual);

        if (contacto === undefined) {
            throw new Error("No existe un contacto con el email " + emailActual);
        }

        const otro = this.buscar(nuevoEmail);

        if (otro !== undefined && otro !== contacto) {
            throw new Error("Ya existe un contacto con el email " + nuevoEmail);
        }

        // Si el nombre o el email son inválidos lanzan error antes de cambiar nada.
        // Primero validamos todo creando un Contacto de prueba, así no queda a medio modificar.
        new Contacto(nuevoNombre, nuevoEmail);

        contacto.setNombre(nuevoNombre);
        contacto.setEmail(nuevoEmail);

    }

    // Devuelve true si lo eliminó, false si no existía.
    eliminar(email: string): boolean {

        const contacto = this.buscar(email);

        if (contacto === undefined) {
            return false;
        }

        this.contactos = this.contactos.filter(c => c !== contacto);

        return true;

    }
    
}