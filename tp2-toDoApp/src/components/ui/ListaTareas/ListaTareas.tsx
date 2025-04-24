import React, { useState, useEffect } from 'react';
import styles from './ListaTareas.module.css';
import { tareaStore } from '../../../store/tareaStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';
import { sprintStore } from '../../../store/sprintStore';


const ListaTareas: React.FC = () => {
  const tareas = tareaStore((state) => state.tareas);
  const tareaActiva = tareaStore((state) => state.tareaActiva);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);
  const actualizarTarea = tareaStore((state) => state.actualizarTarea);
  const sprints = sprintStore((state) => state.sprints);
  const { eliminarTarea } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoVisualizacion, setModoVisualizacion] = useState(false);
  const [sprintSeleccionado, setSprintSeleccionado] = useState<Record<string, string>>({});
  const { putTareaEditar } = useTareas();

  // Filtramos las tareas que no están asignadas a un sprint
  const tareasNoAsignadas = tareas.filter(tarea => !tarea.sprintId);

  useEffect(() => {
    console.log("Tareas actuales en ListaTareas:", tareas);
    console.log("Tareas no asignadas a sprint:", tareasNoAsignadas);
  }, [tareas, tareasNoAsignadas]);
  

  const handleVerTarea = (tarea: ITarea) => {
    console.log("Ver tarea:", tarea);
    setTareaActiva(tarea);
    setModoVisualizacion(true);
    setIsModalOpen(true);
  };
  
  const handleEditar = (tarea: ITarea) => {
    console.log("Editar tarea:", tarea);
    setTareaActiva(tarea);
    setModoVisualizacion(false);
    setIsModalOpen(true);
  };

  const handleEliminar = (idTarea: string) => {
    console.log("Eliminando tarea con ID:", idTarea);
    if (!idTarea) {
      console.error("ID de tarea inválido");
      return;
    }
    
    const tarea = tareas.find(t => t.id === idTarea);
    if (!tarea) {
      console.error("No se encontró la tarea con ID:", idTarea);
      return;
    }
    
    eliminarTarea(idTarea);
  };

  const handleSprintChange = (tareaId: string, sprintId: string) => {
    setSprintSeleccionado({...sprintSeleccionado, [tareaId]: sprintId});
  };

  const handleAsignarSprint = async (tarea: ITarea) => {
    if (!tarea.id || !sprintSeleccionado[tarea.id]) {
        console.error("ID de tarea inválido o no hay sprint seleccionado");
        return;
    }

    const sprintId = sprintSeleccionado[tarea.id];
    const tareaActualizada = {
        ...tarea,
        sprintId: sprintId,
    };

    console.log("Asignando tarea a sprint:", tareaActualizada);

    try {
        await putTareaEditar(tareaActualizada); // Actualiza en el backend
        actualizarTarea(tareaActualizada); // Actualiza el estado en el store
    } catch (error) {
        console.error("Error al asignar sprint:", error);
    }

    // Limpiar el sprint seleccionado para esta tarea
    const nuevosSprintsSeleccionados = { ...sprintSeleccionado };
    delete nuevosSprintsSeleccionados[tarea.id];
    setSprintSeleccionado(nuevosSprintsSeleccionados);
};


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setTareaActiva(null);
      setModoVisualizacion(false);
    }, 100);
  };

  
  useEffect(() => {
    console.log("Tarea activa en ListaTareas:", tareaActiva);
  }, [tareaActiva, isModalOpen]);

  return (
    <div className={styles.taskTable}>
      <div className={styles.taskHeader}>
        <span>Título</span>
        <span>Descripción</span>
        <span>Sprint</span>
      </div>
      {tareasNoAsignadas.length > 0 ? (
        tareasNoAsignadas.map((tarea) => (
          <div key={tarea.id} className={styles.taskRow}>
            <span>{tarea.titulo}</span>
            <span>{tarea.descripcion}</span>
            <span>Sin asignar</span>

            <div className={styles.taskIcons}>
              
              <select 
                className={styles.sprintSelect}
                value={sprintSeleccionado[tarea.id || ''] || ''}
                onChange={(e) => tarea.id && handleSprintChange(tarea.id, e.target.value)}
              >
                <option value="">Seleccionar un sprint</option>
                {sprints.map(sprint => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.titulo}
                  </option>
                ))}
              </select>
              <button
                onClick={() => tarea.id && handleAsignarSprint(tarea)}
                className={`${styles.sprintButton} ${sprintSeleccionado[tarea.id || ''] ? styles.sprintEnabled : styles.sprintDisabled}`}
                disabled={!sprintSeleccionado[tarea.id || '']}
              >
                Enviar a Sprint
              </button>


              
              <button onClick={() => handleVerTarea(tarea)} className={styles.iconButton}>
                <span className="material-symbols-outlined"
                  style={{
                    fontSize: '24px',
                    color: 'white',
                    transition: 'color 0.1s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                >
                  visibility
                </span>
              </button>

              
              <button onClick={() => handleEditar(tarea)} className={styles.iconButton}>
                <span className="material-symbols-outlined"
                  style={{
                    fontSize: '24px',
                    color: 'white',
                    transition: 'color 0.1s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                >
                  edit
                </span>
              </button>

              
              <button onClick={() => tarea.id && handleEliminar(tarea.id)} className={styles.iconButton}>
                <span className="material-symbols-outlined"
                  style={{
                    fontSize: '24px',
                    color: 'white',
                    transition: 'color 0.1s ease-in-out',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}
                >
                  delete
                </span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyTasksMessage}>
          No hay tareas pendientes de asignar a un sprint
        </div>
      )}

      
      {isModalOpen && (
        <Modal 
          handleCloseModal={handleCloseModal}
          modoVisualizacion={modoVisualizacion}
        />
      )}
    </div>
  );
};

export default ListaTareas;