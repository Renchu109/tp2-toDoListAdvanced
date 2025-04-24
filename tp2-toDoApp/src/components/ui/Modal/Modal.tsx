import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { tareaStore } from "../../../store/tareaStore";
import styles from "./Modal.module.css";
import { ITarea } from "../../../types/iTareas";
import { useTareas } from "../../../hooks/useTareas";

type IModal = {
    handleCloseModal: VoidFunction;
    modoVisualizacion?: boolean;
    tareaDirecta?: ITarea | null;
    sprintSeleccionado?: string;
}

const initialState:ITarea = {
    titulo:'',
    descripcion:'',
    fechaLimite:'',
    sprintId: '',
    estado: 'pendiente'
}

export const Modal: FC<IModal> = ({handleCloseModal, modoVisualizacion = false, tareaDirecta, sprintSeleccionado}) => {
    const tareaActiva = tareaStore((state) => state.tareaActiva);
    const setTareaActiva = tareaStore((state) => state.setTareaActiva);
    const {createTarea, putTareaEditar} = useTareas();
    const [formValues, setFormValues] = useState<ITarea>(initialState);

    useEffect(() => {
        console.log("Tarea activa recibida en Modal:", tareaActiva);
        console.log("Tarea directa recibida en Modal:", tareaDirecta);
        
        if(tareaDirecta) {
            setFormValues(tareaDirecta);
        } else if(tareaActiva) {
            setFormValues(tareaActiva);
        } else {
            setFormValues(initialState);
        }
    }, [tareaActiva, tareaDirecta]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [`${name}`]: value }));
    }

    const handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        if(tareaActiva) {
            putTareaEditar(formValues);
        } else {
            
            const estadoInicial = sprintSeleccionado ? 'pendiente' : 'pendiente';
            createTarea({
                ...formValues, 
                id: `${Date.now()}`, 
                sprintId: sprintSeleccionado || '', 
                estado: estadoInicial
            });
        }
    
        setTareaActiva(null);
        handleCloseModal();
    }

   
    console.log("formValues en Modal:", formValues);

    return (
        <div className={styles.containerPrincipalModal}>
            <div className={styles.contentPopUp}>
                <div className={styles.container}>
                    <h3>
                        {modoVisualizacion ? "Detalles de la tarea" : 
                         tareaActiva ? "Editar tarea" : "Crear tarea"}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className={styles.formContent}>
                    <div>
                        {modoVisualizacion ? (
                            <>
                                <div className={styles.viewField}>
                                    <label>Título:</label>
                                    <p>{formValues.titulo || "No disponible"}</p>
                                </div>
                                <div className={styles.viewField}>
                                    <label>Descripción:</label>
                                    <p>{formValues.descripcion || "No disponible"}</p>
                                </div>
                                <div className={styles.viewField}>
                                    <label>Fecha límite:</label>
                                    <p>{formValues.fechaLimite || "No disponible"}</p>
                                </div>
                                <div className={styles.viewField}>
                                    <label>Estado:</label>
                                    <p>{formValues.estado || "No disponible"}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <input 
                                    placeholder="Ingrese un título" 
                                    type="text" 
                                    required 
                                    onChange={handleChange} 
                                    value={formValues.titulo} 
                                    autoComplete="off" 
                                    name="titulo"
                                />
                                <textarea 
                                    placeholder="Ingrese una descripción" 
                                    required 
                                    onChange={handleChange} 
                                    value={formValues.descripcion} 
                                    name="descripcion"
                                ></textarea>
                                <input 
                                    type="date" 
                                    required 
                                    onChange={handleChange} 
                                    value={formValues.fechaLimite} 
                                    autoComplete="off" 
                                    name="fechaLimite"
                                />
                            </>
                        )}
                    </div>

                    <div className={styles.buttonCard}>
                        <button type="button" onClick={() => {
                            setTareaActiva(null);
                            handleCloseModal();
                        }}>
                            Cerrar
                        </button>
                        
                        {!modoVisualizacion && (
                            <button type="submit">
                                {tareaActiva ? "Editar tarea" : "Crear tarea"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}