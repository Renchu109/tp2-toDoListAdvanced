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
    agregarTareaAlSprint: (sprintId: string, nuevaTarea: any) => void
}



export const sprintStore = create<ISprintStore>((set) => ({

    sprints:[],
    sprintActiva: null,

    
    setArraySprints: (arrayDeSprints) => set(() => ({sprints:arrayDeSprints})),

    agregarNuevaSprint: (nuevaSprint) => set((state) => ({sprints: [... state.sprints, nuevaSprint]})),

    editarUnaSprint: (sprintEditada) => set((state) => {
        const arregloSprints = state.sprints.map((sprint) => sprint.id === sprintEditada.id ? {...sprint, ...sprintEditada}: sprint)

        return {sprints: arregloSprints}
    }),

    eliminarUnaSprint: (idSprint) => set((state) => {
    const arregloSprints = state.sprints.filter((sprint) => {
        console.log(`Comparando ${sprint.id} con ${idSprint}`);
        return sprint.id !== idSprint;
    });

    return { sprints: arregloSprints };
}),

agregarTareaAlSprint: (sprintId, nuevaTarea) => set((state) => {
    const nuevosSprints = state.sprints.map((sprint) => {
        if (sprint.id === sprintId) {
            return {
                ...sprint,
                tareas: [...(sprint.tareas || []), nuevaTarea]
            };
        }
        return sprint;
    });

    let nuevaSprintActiva = state.sprintActiva;
    if (state.sprintActiva?.id === sprintId) {
        nuevaSprintActiva = {
            ...state.sprintActiva,
            tareas: [...(state.sprintActiva.tareas || []), nuevaTarea]
        };
    }

    return { 
        sprints: nuevosSprints,
        sprintActiva: nuevaSprintActiva
    };
}),

    setSprintActiva: (sprintActivaIn) => set(() => ({sprintActiva: sprintActivaIn}))
}))

