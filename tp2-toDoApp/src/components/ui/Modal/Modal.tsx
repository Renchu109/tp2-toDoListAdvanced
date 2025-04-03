import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { tareaStore } from "../../../store/tareaStore";
import styles from "./Modal.module.css";
import { ITarea } from "../../../types/iTareas";
import { useTareas } from "../../../hooks/useTareas";
import { sprintStore } from "../../../store/sprintStore";

type IModal = {
    handleCloseModal: VoidFunction
}

const initialState:ITarea = {
    titulo:'',
    descripcion:'',
    fechaLimite:'',
    sprintId: '',
    estado: 'pendiente'
}

export const Modal: FC<IModal> = ({handleCloseModal}) => {

    const tareaActiva = tareaStore((state) => state.tareaActiva)

    const setTareaActiva = tareaStore((state) => state.setTareaActiva)

    const sprints = sprintStore((state) => state.sprints)

    const {createTarea, putTareaEditar} = useTareas()

    const [formValues, setFormValues] = useState<ITarea>(initialState)


    useEffect(() => {
        if(tareaActiva) setFormValues(tareaActiva);
    },[])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [`${name}`]: value }))
    }

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if(tareaActiva) {
            putTareaEditar(formValues)
        }else {
            createTarea({...formValues,id: `${Date.now()}`})
        }

        setTareaActiva(null)
        handleCloseModal()
    }

    return (
        <div className={styles.containerPrincipalModal}>
            <div className={styles.contentPopUp}>
                <div className={styles.container}>
                    <h3>{tareaActiva ? "Editar tarea" : "Crear tarea"}</h3>
                </div>

                <form onSubmit={handleSubmit} className={styles.formContent}>
                    <div >
                        <input placeholder="Ingrese un título" type="text" required onChange={handleChange} value={formValues.titulo} autoComplete="off" name="titulo"/>

                        <textarea placeholder="Ingrese una descripción" required onChange={handleChange} value={formValues.descripcion} name="descripcion"></textarea>

                        <input type="date" required onChange={handleChange} value={formValues.fechaLimite} autoComplete="off" name="fechaLimite"/>
                        <select 
                            name="sprintId" 
                            value={formValues.sprintId || ''} 
                            onChange={handleChange}
                            required
                            className={styles.sprintSelect}
                        >
                            <option value="" disabled>Seleccionar Sprint</option>
                            {sprints.map(sprint => (
                                <option key={sprint.id} value={sprint.id}>
                                    {sprint.titulo}
                                </option>
                            ))}
                        </select>

                        <select 
                            name="estado" 
                            value={formValues.estado} 
                            onChange={handleChange}
                            className={styles.formSelect}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="en_curso">En curso</option>
                            <option value="terminado">Terminado</option>
                        </select>
                    
                    
                    </div>

                    <div className={styles.buttonCard}>
                        <button onClick={handleCloseModal}>Cancelar</button>

                        <button type="submit">{tareaActiva ? "Editar tarea" : "Crear tarea"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
