import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { backlogStore } from "../../../store/backlogStore";
import styles from "./Modal.module.css";
import { ITarea } from "../../../types/iTareas";
import { useTareas } from "../../../hooks/useTareas";
import * as Yup from 'yup';
import { sprintStore } from "../../../store/sprintStore";
import { updateSprintTask } from "../../../data/sprintController";

type IModal = {
    handleCloseModal: VoidFunction;
    modoVisualizacion?: boolean;
    tareaDirecta?: ITarea | null;
    isSprintTask?: boolean;
    sprintSeleccionado?: string;
}

const initialState: ITarea = {
    id: '',
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    estado: 'pendiente'
}

const tareaSchema = Yup.object().shape({
    id: Yup.string(),
    titulo: Yup.string()
        .test('is-empty', 'El título es obligatorio', value => {
            return value !== undefined && value !== '';
        })
        .test('min-length', 'El título debe tener al menos 3 caracteres', value => {
            if (!value) return true;
            return value.length >= 3;
        })
        .max(50, 'El título no puede exceder los 50 caracteres'),
    descripcion: Yup.string()
        .test('is-empty', 'La descripción es obligatoria', value => {
            return value !== undefined && value !== '';
        })
        .test('min-length', 'La descripción debe tener al menos 10 caracteres', value => {
            if (!value) return true;
            return value.length >= 10;
        })
        .max(500, 'La descripción no puede exceder los 500 caracteres'),
    fechaLimite: Yup.date()
        .required('La fecha límite es obligatoria')
        .transform((value, originalValue) => {
            if (originalValue === '') return undefined;
            return value;
        })
        .typeError('La fecha límite debe ser una fecha válida')
        .min(new Date(), 'La fecha límite debe ser posterior a hoy'),
    estado: Yup.string()
        .oneOf(['pendiente', 'en_curso', 'terminado'], 'Estado no válido')
        .default('pendiente')
});

export const Modal: FC<IModal> = ({ handleCloseModal, modoVisualizacion = false, tareaDirecta, isSprintTask = false, sprintSeleccionado }) => {
    const tareaActiva = backlogStore((state) => state.tareaActiva);
    const setTareaActiva = backlogStore((state) => state.setTareaActiva);
    const { createTarea, putTareaEditar } = useTareas();
    const [formValues, setFormValues] = useState<ITarea>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (tareaDirecta) {
            setFormValues(tareaDirecta);
        } else if (tareaActiva) {
            setFormValues(tareaActiva);
        } else {
            setFormValues({...initialState, id: `temp_${Date.now()}`});
        }
        setErrors({});
        setTouched({});
    }, [tareaActiva, tareaDirecta]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        
        setTouched(prev => ({ ...prev, [name]: true }));
        
        validateField(name, value);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formValues[name as keyof ITarea]);
    }

    const validateField = async (name: string, value: any) => {
        try {
            try {
                const fieldSchema = Yup.reach(tareaSchema, name);
                if ('validate' in fieldSchema) {
                    await fieldSchema.validate(value);
                    setErrors(prev => ({ ...prev, [name]: '' }));
                }
            } catch (err) {
                console.error(`Error accessing schema field: ${name}`, err);
                return;
            }
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors(prev => ({ ...prev, [name]: error.message }));
            }
        }
    }

    const validateForm = async () => {
        try {
            await tareaSchema.validate(formValues, { abortEarly: false });
            return true;
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const newErrors: Record<string, string> = {};
                error.inner.forEach(err => {
                    if (err.path) {
                        newErrors[err.path] = err.message;
                    }
                });
                setErrors(newErrors);
                
                const allTouched: Record<string, boolean> = {};
                Object.keys(formValues).forEach(key => {
                    allTouched[key] = true;
                });
                setTouched(allTouched);
            }
            return false;
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const isValid = await validateForm();

        if (isValid) {
            if (tareaActiva) {
                if (isSprintTask && sprintStore.getState().sprintActiva?.id) {
                    try {
                        const sprintId = sprintStore.getState().sprintActiva?.id;
                        if (sprintId) {
                            await updateSprintTask(sprintId, formValues);
                            
                            const sprintActual = sprintStore.getState().sprintActiva;
                            if (sprintActual && sprintActual.tareas) {
                                const tareasActualizadas = sprintActual.tareas.map(t => 
                                    t.id === formValues.id ? formValues : t
                                );
                                
                                const sprintActualizado = {
                                    ...sprintActual,
                                    tareas: tareasActualizadas
                                };
                                
                                sprintStore.getState().setSprintActiva(sprintActualizado);
                            }
                        }
                    } catch (error) {
                        console.error("Error al actualizar tarea en sprint:", error);
                    }
                } else {
                    putTareaEditar(formValues);
                }
            } else {
                const nuevaTarea: ITarea = {
                    ...formValues,
                    id: `tarea_${Date.now()}`,
                    estado: 'pendiente' as 'pendiente' | 'en_curso' | 'terminado'
                };
                
                
                if (sprintSeleccionado) {
                    sprintStore.getState().agregarTareaAlSprint(sprintSeleccionado, nuevaTarea);
                } else {
                    createTarea(nuevaTarea);
                }
                
            }

            setTareaActiva(null);
            handleCloseModal();
        }

        setIsSubmitting(false);
    }
    
    const shouldShowError = (fieldName: string): boolean => {
        return !!touched[fieldName] && !!errors[fieldName];
    }

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
                                <div className={styles.formGroup}>
                                    <input
                                        placeholder="Ingrese un título"
                                        type="text"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formValues.titulo}
                                        autoComplete="off"
                                        name="titulo"
                                        className={shouldShowError('titulo') ? styles.inputError : ''}
                                    />
                                    {shouldShowError('titulo') && 
                                        <div className={styles.errorMessage}>{errors.titulo}</div>}
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <textarea
                                        placeholder="Ingrese una descripción"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formValues.descripcion}
                                        name="descripcion"
                                        className={shouldShowError('descripcion') ? styles.inputError : ''}
                                    ></textarea>
                                    {shouldShowError('descripcion') && 
                                        <div className={styles.errorMessage}>{errors.descripcion}</div>}
                                </div>
                                
                                <div className={styles.formGroup}>
                                    <input
                                        type="date"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={formValues.fechaLimite}
                                        autoComplete="off"
                                        name="fechaLimite"
                                        className={shouldShowError('fechaLimite') ? styles.inputError : ''}
                                    />
                                    {shouldShowError('fechaLimite') && 
                                        <div className={styles.errorMessage}>{errors.fechaLimite}</div>}
                                </div>
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
                            <button type="submit" disabled={isSubmitting}>
                                {tareaActiva ? "Editar tarea" : "Crear tarea"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}