// RF-03: un contacto tiene nombre completo y dirección de correo.

export class Contacto {

    private nombre: string;
    private email: string;

    constructor(nombre: string, email: string) {

        this.nombre = this.validarNombre(nombre);
        this.email = this.validarEmail(email);

    }

    getNombre(): string {

        return this.nombre;

    }

    getEmail(): string {

        return this.email;

    }

    // Los cambios pasan por las mismas validaciones que el constructor.
    setNombre(nombre: string): void {

        this.nombre = this.validarNombre(nombre);

    }

    setEmail(email: string): void {

        this.email = this.validarEmail(email);

    }

    // Devuelve el dominio del email (ej: "ucp.edu.ar"). Lo van a usar los filtros del Sprint 2.
    getDominio(): string {

        return this.email.split("@")[1];

    }

    toString(): string {

        return this.nombre + " <" + this.email + ">";

    }

    // El nombre no puede estar vacío.
    private validarNombre(nombre: string): string {

        if (nombre.trim() === "") {
            throw new Error("El nombre del contacto es obligatorio");
        }

        return nombre.trim();

    }

    // Formato aceptable: una sola @, algo antes de la @ y un punto después.
    // Devuelve el email en minúsculas para que "ANA@x.com" y "ana@x.com" sean el mismo contacto.
    private validarEmail(email: string): string {

        const limpio = email.trim().toLowerCase();
        const partes = limpio.split("@");   // "ana@ucp.edu.ar" -> ["ana", "ucp.edu.ar"]

        const esValido = partes.length === 2 && partes[0] !== "" && partes[1].includes(".");

        if (!esValido) {
            throw new Error("El email no tiene un formato válido: " + email);
        }

        return limpio;

    }
}