import axios from "axios";
import { ISprint } from "../types/iSprints";
import { URL_SPRINT } from "../utils/constantes";

export const getAllSprints = async () => {
    try {
        const response = await axios.get<ISprint[]>(URL_SPRINT)

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const postNuevaSprint = async (nuevaSprint: ISprint) => {
    try {
        const response = await axios.post<ISprint>(URL_SPRINT, {
            ...nuevaSprint,
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const editarSprint = async (sprintActualizada: ISprint) => {
    try {
        const response = await axios.put<ISprint>(`${URL_SPRINT}/${sprintActualizada.id}`, {
            ...sprintActualizada,
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const eliminarSprintPorId = async (idSprint: string) => {
    try {
        const response = await axios.delete<ISprint>(`${URL_SPRINT}/${idSprint}`)

        return response.data
    } catch (error) {
        console.log(error);
    }
}