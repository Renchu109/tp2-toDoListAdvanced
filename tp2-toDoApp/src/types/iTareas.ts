export interface ITarea{
    id?:string
    titulo:string
    descripcion:string
    fechaLimite:string
    sprintId?: string
    estado: 'pendiente' | 'en_curso' | 'terminado'
}