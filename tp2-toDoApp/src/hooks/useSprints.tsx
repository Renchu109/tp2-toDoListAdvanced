import { useShallow } from "zustand/shallow"
import { sprintStore } from "../store/sprintStore"
import { editarSprint, eliminarSprintPorId, getAllSprints, postNuevaSprint } from "../http/sprint"
import { ISprint } from "../types/iSprints"
import Swal from "sweetalert2"


export const useSprints = () => {

    const {sprints,setArraySprints,agregarNuevaSprint,eliminarUnaSprint,editarUnaSprint} = sprintStore(useShallow((state) => ({
        sprints: state.sprints,
        setArraySprints: state.setArraySprints,
        agregarNuevaSprint: state.agregarNuevaSprint,
        eliminarUnaSprint: state.eliminarUnaSprint,
        editarUnaSprint: state.editarUnaSprint
    })))

    const getSprints = async() => {
        const data = await getAllSprints();
        if(data) setArraySprints(data);
    }

    const createSprint = async (nuevaSprint:ISprint) => {
        agregarNuevaSprint(nuevaSprint)
        try {
            await postNuevaSprint(nuevaSprint);
            Swal.fire("Éxito", "Sprint creada correctamente", "success")
        }catch (error){
            eliminarUnaSprint(nuevaSprint.id!);
            console.log("Algo salió mal al crear la sprint")
        }
    }

    const putSprintEditar = async (sprintEditada:ISprint) => {

        const estadoPrevio = sprints.find((el) => el.id === sprintEditada.id)

        editarUnaSprint(sprintEditada)
        try {
            await editarSprint(sprintEditada);
            Swal.fire("Éxito", "Sprint actualizada correctamente", "success")
        }catch (error) {
            if (estadoPrevio) editarUnaSprint(estadoPrevio);
            console.log("Algo salió mal al editar")
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
            await eliminarSprintPorId(idSprint);
            Swal.fire("Eliminado", "La sprint se eliminó correctamente", "success")
        } catch (error) {
            if (estadoPrevio) agregarNuevaSprint(estadoPrevio)
            console.log("Algo salió mal al editar")
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
