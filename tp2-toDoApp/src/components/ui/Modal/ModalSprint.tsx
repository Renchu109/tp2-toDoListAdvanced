import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { sprintStore } from "../../../store/sprintStore";
import styles from "./ModalSprint.module.css";
import { ISprint } from "../../../types/iSprints";
import { useSprints } from "../../../hooks/useSprints";

type IModalSprint = {
    handleCloseModalSprint: VoidFunction;
    forceCreateMode?: boolean;
}

const initialState:ISprint = {
    titulo:'',
    fechaInicio:'',
    fechaCierre:''
}

export const ModalSprint: FC<IModalSprint> = ({handleCloseModalSprint, forceCreateMode = false}) => {
    const sprintActiva = sprintStore((state) => state.sprintActiva);
    const setSprintActiva = sprintStore((state) => state.setSprintActiva);
    const {createSprint, putSprintEditar, getSprints} = useSprints();
    const [formValues, setFormValues] = useState<ISprint>(initialState);

    useEffect(() => {
        if (forceCreateMode) {
            setFormValues(initialState);
        } else if (sprintActiva) {
            setFormValues(sprintActiva);
        } else {
            setFormValues(initialState);
        }
    }, [sprintActiva, forceCreateMode]);

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        setFormValues((prev) => ({...prev, [`${name}`]:value}));
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault();
        
        // Asegurarse de que los datos son válidos
        if (!formValues.titulo || !formValues.fechaInicio || !formValues.fechaCierre) {
            alert("Por favor complete todos los campos");
            return;
        }
        
        try {
            if (sprintActiva && !forceCreateMode) {
                await putSprintEditar(formValues);
            } else {
                // Generar ID único
                const newId = `sprint_${Date.now()}`;
                await createSprint({...formValues, id: newId});
            }
            
            // Recargar los sprints después de crear o editar
            await getSprints();
            
            // Limpiar el estado y cerrar el modal
            setSprintActiva(null);
            handleCloseModalSprint();
        } catch (error) {
            console.error("Error al guardar el sprint:", error);
            alert("Ocurrió un error al guardar el sprint");
        }
    }

    return (
        <div className={styles.containerPrincipalModalSprint}>
            <div className={styles.contentPopUp}>
                <div className={styles.container}>
                    <h3>{forceCreateMode ? "Crear sprint" : sprintActiva ? "Editar sprint" : "Crear sprint"}</h3>
                </div>

                <form onSubmit={handleSubmit} className={styles.formContent}>
                    <div>
                        <input 
                            placeholder="Ingrese un título" 
                            type="text" 
                            required 
                            onChange={handleChange} 
                            value={formValues.titulo} 
                            autoComplete="off" 
                            name="titulo"
                        />
                        <input 
                            type="date" 
                            required 
                            onChange={handleChange} 
                            value={formValues.fechaInicio} 
                            autoComplete="off" 
                            name="fechaInicio"
                        />
                        <input 
                            type="date" 
                            required 
                            onChange={handleChange} 
                            value={formValues.fechaCierre} 
                            autoComplete="off" 
                            name="fechaCierre"
                        />
                    </div>

                    <div className={styles.buttonCard}>
                        <button type="button" onClick={() => {
                            setSprintActiva(null);
                            handleCloseModalSprint();
                        }}>
                            Cancelar
                        </button>

                        <button type="submit">
                            {forceCreateMode ? "Crear sprint" : sprintActiva ? "Editar sprint" : "Crear sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}