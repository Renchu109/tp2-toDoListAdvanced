import React, { useState, useEffect } from 'react';
import styles from './ListaTareas.module.css';
import { backlogStore } from '../../../store/backlogStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';
import { sprintStore } from '../../../store/sprintStore';
import { getAllSprints } from '../../../data/sprintController';

const ListaTareas: React.FC = () => {
  const tareas = backlogStore((state) => state.tareas);
  const tareaActiva = backlogStore((state) => state.tareaActiva);
  const setTareaActiva = backlogStore((state) => state.setTareaActiva);
  const sprints = sprintStore((state) => state.sprints);
  const setArraySprints = sprintStore((state) => state.setArraySprints);
  const { eliminarTarea, asignarTareaASprint } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoVisualizacion, setModoVisualizacion] = useState(false);
  const [sprintSeleccionado, setSprintSeleccionado] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log("Tareas actuales en ListaTareas:", tareas);
  }, [tareas]);
  
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
    try {
        await asignarTareaASprint(tarea.id, sprintId);
        
        const updatedSprints = await getAllSprints();
        setArraySprints(updatedSprints);
        
        const nuevosSprintsSeleccionados = { ...sprintSeleccionado };
        delete nuevosSprintsSeleccionados[tarea.id];
        setSprintSeleccionado(nuevosSprintsSeleccionados);
    } catch (error) {
        console.error("Error al asignar sprint:", error);
    }
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
      {tareas.length > 0 ? (
        tareas.map((tarea) => (
          <div key={tarea.id} className={`${styles.taskRow} ? styles.taskUrgent : ''}`}
          >
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
                    {sprint.nombre}
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