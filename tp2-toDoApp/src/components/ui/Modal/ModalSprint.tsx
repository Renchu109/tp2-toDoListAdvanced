import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { sprintStore } from "../../../store/sprintStore";
import styles from "./ModalSprint.module.css";
import { ISprint } from "../../../types/iSprints";
import { useSprints } from "../../../hooks/useSprints";
import * as Yup from 'yup';

type IModalSprint = {
    handleCloseModalSprint: VoidFunction;
    forceCreateMode?: boolean;
}

const initialState: ISprint = {
    nombre: '',
    fechaInicio: '',
    fechaCierre: '',
    tareas: []
}

const sprintSchema = Yup.object().shape({
    nombre: Yup.string()
        .test('is-empty', 'El nombre es obligatorio', value => {
            return value !== undefined && value !== '';
        })
        .test('min-length', 'El nombre debe tener al menos 3 caracteres', value => {
            if (!value) return true; 
            return value.length >= 3;
        })
        .max(50, 'El nombre no puede exceder los 50 caracteres'),
    fechaInicio: Yup.date()
        .required('La fecha de inicio es obligatoria')
        .transform((value, originalValue) => {
            if (originalValue === '') return undefined;
            return value;
        })
        .typeError('La fecha de inicio debe ser una fecha válida'),
    fechaCierre: Yup.date()
        .required('La fecha de cierre es obligatoria')
        .transform((value, originalValue) => {
            if (originalValue === '') return undefined;
            return value;
        })
        .typeError('La fecha de cierre debe ser una fecha válida')
        .test('fecha-posterior', 'La fecha de cierre debe ser posterior a la fecha de inicio', 
            function(value) {
                const { fechaInicio } = this.parent;
                if (!fechaInicio || !value) return true;
                return new Date(value) > new Date(fechaInicio);
            }
        ),
    tareas: Yup.array().default([])
});

export const ModalSprint: FC<IModalSprint> = ({ handleCloseModalSprint, forceCreateMode = false }) => {
    const sprintActiva = sprintStore((state) => state.sprintActiva);
    const setSprintActiva = sprintStore((state) => state.setSprintActiva);
    const { createSprint, putSprintEditar, getSprints } = useSprints();
    const [formValues, setFormValues] = useState<ISprint>(initialState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (forceCreateMode) {
            setFormValues(initialState);
        } else if (sprintActiva) {
            setFormValues(sprintActiva);
        } else {
            setFormValues(initialState);
        }
        setErrors({});
        setTouched({});
    }, [sprintActiva, forceCreateMode]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
        
        setTouched(prev => ({ ...prev, [name]: true }));
        
        validateField(name, value);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        validateField(name, formValues[name as keyof ISprint]);
    }

    const validateField = async (name: string, value: any) => {
        try {
            if (name === 'fechaCierre' || name === 'fechaInicio') {
                const updatedValues = {
                    ...formValues,
                    [name]: value
                };
                
                const { fechaInicio, fechaCierre } = updatedValues;
                
                if (name === 'fechaInicio' && fechaCierre && fechaInicio) {
                    if (new Date(fechaInicio) >= new Date(fechaCierre)) {
                        setErrors(prev => ({ 
                            ...prev, 
                            fechaCierre: 'La fecha de cierre debe ser posterior a la fecha de inicio' 
                        }));
                    } else {
                        setErrors(prev => ({ ...prev, fechaCierre: '' }));
                    }
                }
                
                if (name === 'fechaCierre' && fechaInicio && fechaCierre) {
                    if (new Date(fechaCierre) <= new Date(fechaInicio)) {
                        setErrors(prev => ({ 
                            ...prev, 
                            fechaCierre: 'La fecha de cierre debe ser posterior a la fecha de inicio' 
                        }));
                    } else {
                        setErrors(prev => ({ ...prev, fechaCierre: '' }));
                    }
                }
            }
            
            try {
                const fieldSchema = Yup.reach(sprintSchema, name);
                if ('validate' in fieldSchema) {
                    await fieldSchema.validate(value);
                    if (errors[name] !== 'La fecha de cierre debe ser posterior a la fecha de inicio') {
                        setErrors(prev => ({ ...prev, [name]: '' }));
                    }
                }
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    setErrors(prev => ({ ...prev, [name]: err.message }));
                }
            }
            
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors(prev => ({ ...prev, [name]: error.message }));
            }
        }
    }

    const validateForm = async () => {
        try {
            await sprintSchema.validate(formValues, { abortEarly: false });
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
            try {
                if (sprintActiva && !forceCreateMode) {
                    await putSprintEditar(formValues);
                } else {
                    const newId = `sprint_${Date.now()}`;
                    await createSprint({ ...formValues, id: newId, tareas: [] });
                }

                await getSprints();
                setSprintActiva(null);
                handleCloseModalSprint();
            } catch (error) {
                console.error("Error al guardar el sprint:", error);
                alert("Ocurrió un error al guardar el sprint");
            }
        }
        
        setIsSubmitting(false);
    }

    const shouldShowError = (fieldName: string): boolean => {
        return !!touched[fieldName] && !!errors[fieldName];
    }

    return (
        <div className={styles.containerPrincipalModalSprint}>
            <div className={styles.contentPopUp}>
                <div className={styles.container}>
                    <h3>{forceCreateMode ? "Crear sprint" : sprintActiva ? "Editar sprint" : "Crear sprint"}</h3>
                </div>

                <form onSubmit={handleSubmit} className={styles.formContent}>
                    <div>
                        <div className={styles.formGroup}>
                            <input
                                placeholder="Ingrese un nombre"
                                type="text"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={formValues.nombre}
                                autoComplete="off"
                                name="nombre"
                                className={shouldShowError('nombre') ? styles.inputError : ''}
                            />
                            {shouldShowError('nombre') && 
                                <div className={styles.errorMessage}>{errors.nombre}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="date"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={formValues.fechaInicio}
                                autoComplete="off"
                                name="fechaInicio"
                                className={shouldShowError('fechaInicio') ? styles.inputError : ''}
                            />
                            {shouldShowError('fechaInicio') && 
                                <div className={styles.errorMessage}>{errors.fechaInicio}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="date"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={formValues.fechaCierre}
                                autoComplete="off"
                                name="fechaCierre"
                                className={shouldShowError('fechaCierre') ? styles.inputError : ''}
                            />
                            {shouldShowError('fechaCierre') && 
                                <div className={styles.errorMessage}>{errors.fechaCierre}</div>}
                        </div>
                    </div>

                    <div className={styles.buttonCard}>
                        <button type="button" onClick={() => {
                            setSprintActiva(null);
                            handleCloseModalSprint();
                        }}>
                            Cancelar
                        </button>

                        <button type="submit" disabled={isSubmitting}>
                            {forceCreateMode ? "Crear sprint" : sprintActiva ? "Editar sprint" : "Crear sprint"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}