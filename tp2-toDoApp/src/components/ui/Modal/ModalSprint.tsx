import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { sprintStore } from "../../../store/sprintStore";
import styles from "./ModalSprint.module.css";
import { ISprint } from "../../../types/iSprints";
import { useSprints } from "../../../hooks/useSprints";

type IModalSprint = {
    handleCloseModalSprint: VoidFunction
}

const initialState:ISprint = {
    titulo:'',
    fechaInicio:'',
    fechaCierre:''
}

export const ModalSprint: FC<IModalSprint> = ({handleCloseModalSprint}) => {
    const sprintActiva = sprintStore((state) => state.sprintActiva);
    const setSprintActiva = sprintStore((state) => state.setSprintActiva);
    const {createSprint, putSprintEditar} = useSprints();
    const [formValues, setFormValues] = useState<ISprint>(initialState);

    useEffect(() => {
        if(sprintActiva) {
            setFormValues(sprintActiva);
        } else {
            setFormValues(initialState);
        }
    }, [sprintActiva]);

    const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = e.target;
        setFormValues((prev) => ({...prev, [`${name}`]:value}));
    }

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if(sprintActiva) {
            putSprintEditar(formValues);
        } else {
            createSprint({...formValues, id: `${Date.now()}`});
        }

        setSprintActiva(null);
        handleCloseModalSprint();
    }

    return (
        <div className={styles.containerPrincipalModalSprint}>
            <div className={styles.contentPopUp}>
                <div className={styles.container}>
                    <h3>{sprintActiva ? "Editar sprint" : "Crear sprint"}</h3>
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
                            {sprintActiva ? "Editar sprint" : "Crear sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}