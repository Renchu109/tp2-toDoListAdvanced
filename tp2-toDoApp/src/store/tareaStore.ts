import { create } from "zustand";
import { ITarea } from "../types/iTareas";


interface ITareaStore {
    tareas: ITarea[]
    tareaActiva:ITarea|null
    setTareaActiva: (tareaActiva: ITarea|null) => void
    setArrayTareas: (arrayDeTareas: ITarea[]) => void
    agregarNuevaTarea: (nuevaTarea: ITarea) => void
    editarUnaTarea: (tareaActualizada: ITarea) => void
    eliminarUnaTarea: (idTarea: string) => void
    actualizarTarea: (tarea: ITarea) => void;
}



export const tareaStore = create<ITareaStore>((set) => ({

    tareas:[],
    tareaActiva: null,


    actualizarTarea: (tarea) => set((state) => ({
        tareas: state.tareas.map((t) => (t.id === tarea.id ? tarea : t)),
      })),

    setArrayTareas: (arrayDeTareas) => set(() => ({tareas:arrayDeTareas})),

    agregarNuevaTarea: (nuevaTarea) => set((state) => ({tareas: [... state.tareas, nuevaTarea]})),

    editarUnaTarea: (tareaEditada) => set((state) => {
        const arregloTareas = state.tareas.map((tarea) => tarea.id === tareaEditada.id ? {...tarea, ...tareaEditada}: tarea)

        return {tareas: arregloTareas}
    }),

    eliminarUnaTarea: (idTarea) => set((state) => {
    const arregloTareas = state.tareas.filter((tarea) => {
        console.log(`Comparando ${tarea.id} con ${idTarea}`);
        return tarea.id !== idTarea;
    });

    return { tareas: arregloTareas };
}),

    setTareaActiva: (tareaActivaIn) => set(() => ({tareaActiva: tareaActivaIn}))
}))


