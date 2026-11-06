import { Correo } from "./Correo";
import { Filtro } from "./Filtro";

// RF-05: guarda los filtros registrados (máximo 5) y permite aplicarlos por nombre.

export class RegistroFiltros {
    private static readonly MAXIMO = 5;
    private filtros: Filtro[] = [];

    agregar(filtro: Filtro): void {
        if (this.filtros.length >= RegistroFiltros.MAXIMO) {
            throw new Error("Solo se pueden registrar " + RegistroFiltros.MAXIMO + " filtros");
        }
        if (this.obtener(filtro.getNombre()) !== undefined) {
            throw new Error("Ya existe un filtro llamado " + filtro.getNombre());
        }
        this.filtros.push(filtro);
    }

    obtener(nombre: string): Filtro | undefined {
        return this.filtros.find(filtro => filtro.getNombre().toLowerCase() === nombre.trim().toLowerCase());
    }

    listar(): Filtro[] {
        return [...this.filtros];
    }

    aplicar(nombre: string, correos: Correo[]): Correo[] {
        const filtro = this.obtener(nombre);
        if (filtro === undefined) {
            throw new Error("No existe el filtro " + nombre);
        }
        return filtro.aplicar(correos);
    }
}
