import { create } from "zustand";
import { ITarea } from "../types/iTareas";

interface IBacklogStore {
    tareas: ITarea[]
    tareaActiva: ITarea | null
    setTareaActiva: (tareaActiva: ITarea | null) => void
    setArrayTareas: (arrayDeTareas: ITarea[]) => void
    agregarNuevaTarea: (nuevaTarea: ITarea) => void
    editarUnaTarea: (tareaActualizada: ITarea) => void
    eliminarUnaTarea: (idTarea: string) => void
}

export const backlogStore = create<IBacklogStore>((set) => ({
    tareas: [],
    tareaActiva: null,
    
    setArrayTareas: (arrayDeTareas) => set(() => ({ tareas: arrayDeTareas })),

    agregarNuevaTarea: (nuevaTarea) => set((state) => ({ tareas: [...state.tareas, nuevaTarea] })),

    editarUnaTarea: (tareaActualizada) => set((state) => {
        const arregloTareas = state.tareas.map((tarea) => 
            tarea.id === tareaActualizada.id ? tareaActualizada : tarea
        );
        
        return { tareas: arregloTareas };
    }),

    eliminarUnaTarea: (idTarea) => set((state) => {
        const arregloTareas = state.tareas.filter(tarea => tarea.id !== idTarea);
        return { tareas: arregloTareas };
    }),

    setTareaActiva: (tareaActivaIn) => set(() => ({ tareaActiva: tareaActivaIn }))
}));