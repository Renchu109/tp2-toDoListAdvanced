import axios from "axios";
import { ITarea } from "../types/iTareas";
import { URL_BACKLOG } from "../utils/constantes";

export const getAllTareas = async () => {
    try {
        const response = await axios.get<ITarea[]>(URL_BACKLOG)

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const postNuevaTarea = async (nuevaTarea: ITarea) => {
    try {
        const response = await axios.post<ITarea>(URL_BACKLOG, {
            ...nuevaTarea,
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const editarTarea = async (tareaActualizada: ITarea) => {
    try {
        const response = await axios.put(`${URL_BACKLOG}/${tareaActualizada.id}`, {
            titulo: tareaActualizada.titulo,
            descripcion: tareaActualizada.descripcion,
            fechaLimite: tareaActualizada.fechaLimite,
            sprintId: tareaActualizada.sprintId, 
            estado: tareaActualizada.estado,   
        });

        return response.data;
    } catch (error) {
        console.log("Error al actualizar la tarea:", error);
        throw error; 
    }
};



export const eliminarTareaPorId = async (idTarea: string) => {
    try {
        const response = await axios.delete<ITarea>(`${URL_BACKLOG}/${idTarea}`)

        return response.data
    } catch (error) {
        console.log(error);
    }
}