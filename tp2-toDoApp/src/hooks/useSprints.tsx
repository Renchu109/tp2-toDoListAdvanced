import { useShallow } from "zustand/shallow"
import { sprintStore } from "../store/sprintStore"
import { ISprint } from "../types/iSprints"
import Swal from "sweetalert2"
import { 
    getAllSprints, 
    createSprint as createSprintAPI, 
    updateSprint, 
    deleteSprint as deleteSprintAPI 
} from "../data/sprintController"

export const useSprints = () => {
    const {sprints, setArraySprints, agregarNuevaSprint, eliminarUnaSprint, editarUnaSprint} = sprintStore(useShallow((state) => ({
        sprints: state.sprints,
        setArraySprints: state.setArraySprints,
        agregarNuevaSprint: state.agregarNuevaSprint,
        eliminarUnaSprint: state.eliminarUnaSprint,
        editarUnaSprint: state.editarUnaSprint
    })))

    const getSprints = async() => {
        try {
            const data = await getAllSprints();
            if(data) setArraySprints(data);
        } catch (error) {
            console.error("Error obteniendo sprints:", error);
            Swal.fire("Error", "No se pudieron cargar los sprints", "error");
        }
    }

    const createSprint = async (nuevaSprint:ISprint) => {
        agregarNuevaSprint(nuevaSprint)
        try {
            await createSprintAPI(nuevaSprint);
            Swal.fire("Éxito", "Sprint creado correctamente", "success")
        } catch (error) {
            eliminarUnaSprint(nuevaSprint.id!);
            console.error("Error al crear el sprint:", error);
            Swal.fire("Error", "No se pudo crear el sprint", "error");
        }
    }

    const putSprintEditar = async (sprintEditada: ISprint) => {
        const estadoPrevio = sprints.find((el) => el.id === sprintEditada.id);
        
        editarUnaSprint(sprintEditada);
        
        try {
            await updateSprint(sprintEditada);
            Swal.fire("Éxito", "Sprint actualizado correctamente", "success");
        } catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio);
            console.error("Error al editar el sprint:", error);
            Swal.fire("Error", "No se pudo actualizar el sprint", "error");
        }
    }

    const eliminarSprint = async (idSprint:string) => {
        const estadoPrevio = sprints.find((el) => el.id === idSprint)

        const confirm = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        });

        if (!confirm.isConfirmed) return;
        eliminarUnaSprint(idSprint)
        try {
            await deleteSprintAPI(idSprint);
            Swal.fire("Eliminado", "El sprint se eliminó correctamente", "success")
        } catch (error) {
            if (estadoPrevio) agregarNuevaSprint(estadoPrevio)
            console.error("Error al eliminar el sprint:", error);
            Swal.fire("Error", "No se pudo eliminar el sprint", "error");
        }
    }

    return {
        getSprints,
        createSprint,
        putSprintEditar,
        eliminarSprint,
        sprints
    }
}