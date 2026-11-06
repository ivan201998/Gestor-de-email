import { Correo } from "./Correo";
import { Predicado } from "./Predicado";

// RF-05: un filtro tiene un nombre y una condición (predicado).

export class Filtro {
    private readonly nombre: string;
    private readonly condicion: Predicado;

    constructor(nombre: string, condicion: Predicado) {
        if (nombre.trim() === "") {
            throw new Error("El filtro debe tener nombre");
        }
        this.nombre = nombre.trim();
        this.condicion = condicion;
    }

    getNombre(): string {
        return this.nombre;
    }

    aplicar(correos: Correo[]): Correo[] {
        return correos.filter(this.condicion);
    }
}
