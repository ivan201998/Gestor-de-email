// RF-03: un contacto tiene nombre completo y dirección de correo.

export class Contacto {
   private nombre: string;
   private email: string;

    constructor(nombre: string, email: string) {

        this.nombre = Contacto.validarNombre(nombre);
        this.email = Contacto.validarEmail(email);

    }

    getNombre(): string {

        return this.nombre;

    }

    getEmail(): string {

        return this.email;

    }

    // Los cambios pasan por las mismas validaciones que el constructor.
    setNombre(nombre: string): void {

        this.nombre = Contacto.validarNombre(nombre);

    }

    
}