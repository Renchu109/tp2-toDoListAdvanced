import { create } from "zustand";
import { ISprint } from "../types/iSprints";


interface ISprintStore {
    sprints: ISprint[]
    sprintActiva:ISprint|null
    setSprintActiva: (sprintActiva: ISprint|null) => void
    setArraySprints: (arrayDeSprints: ISprint[]) => void
    agregarNuevaSprint: (nuevaSprint: ISprint) => void
    editarUnaSprint: (sprintActualizada: ISprint) => void
    eliminarUnaSprint: (idSprint: string) => void
}



export const sprintStore = create<ISprintStore>((set) => ({

    sprints:[],
    sprintActiva: null,

    //funciones modificadoras para el array

    //agregar array de sprints
    setArraySprints: (arrayDeSprints) => set(() => ({sprints:arrayDeSprints})),

    //agregar una sprint al array
    agregarNuevaSprint: (nuevaSprint) => set((state) => ({sprints: [... state.sprints, nuevaSprint]})),

    //editar una sprint del array
    editarUnaSprint: (sprintEditada) => set((state) => {
        const arregloSprints = state.sprints.map((sprint) => sprint.id === sprintEditada.id ? {...sprint, ...sprintEditada}: sprint)

        return {sprints: arregloSprints}
    }),

    //eliminar una sprint del array
    eliminarUnaSprint: (idSprint) => set((state) => {
    const arregloSprints = state.sprints.filter((sprint) => {
        console.log(`Comparando ${sprint.id} con ${idSprint}`);
        return sprint.id !== idSprint;
    });

    return { sprints: arregloSprints };
}),

    //setear la sprint activa
    setSprintActiva: (sprintActivaIn) => set(() => ({sprintActiva: sprintActivaIn}))
}))