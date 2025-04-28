import { ITarea } from "./iTareas"

export interface ISprint {
    id?: string
    nombre: string
    fechaInicio: string
    fechaCierre: string
    tareas: ITarea[]
}