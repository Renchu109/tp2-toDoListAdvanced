import axios from "axios";
import { ISprint } from "../types/iSprints";

const API_URL = "http://localhost:3001/sprints";


export const getAllSprints = async () => {
    try {
        const response = await axios.get<ISprint[]>(API_URL)

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const postNuevaSprint = async (nuevaSprint: ISprint) => {
    try {
        const response = await axios.post<ISprint>(API_URL, {
            ...nuevaSprint,
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const editarSprint = async (sprintActualizada: ISprint) => {
    try {
        const response = await axios.put<ISprint>(`${API_URL}/${sprintActualizada.id}`, {
            ...sprintActualizada,
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
}


export const eliminarSprintPorId = async (idSprint: string) => {
    try {
        const response = await axios.delete<ISprint>(`${API_URL}/${idSprint}`)

        return response.data
    } catch (error) {
        console.log(error);
    }
}