import React, { useState } from 'react';
import styles from './ListaTareasSprint.module.css';
import { backlogStore } from '../../../store/backlogStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';
import { sprintStore } from '../../../store/sprintStore';
import Swal from 'sweetalert2';
import { removeTaskFromSprint } from '../../../data/sprintController';
import { getAllBacklogTasks } from '../../../data/backlogController';

const ListaTareasSprint: React.FC = () => {
  const sprintActiva = sprintStore((state) => state.sprintActiva);
  const setTareaActiva = backlogStore((state) => state.setTareaActiva);
  const setArrayTareas = backlogStore((state) => state.setArrayTareas);
  const { putTareaEditar } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoVisualizacion, setModoVisualizacion] = useState(false);

  const esFechaProxima = (fechaLimite: string): boolean => {
    if (!fechaLimite) return false;
    
    const fechaLimiteDate = new Date(fechaLimite);
    const hoy = new Date();
    
    hoy.setHours(0, 0, 0, 0);
    
    const diferenciaTiempo = fechaLimiteDate.getTime() - hoy.getTime();
    const diferenciaDias = Math.ceil(diferenciaTiempo / (1000 * 3600 * 24));
    
    return diferenciaDias >= 0 && diferenciaDias <= 3;
  };

  const getTareasFiltradas = (estado: 'pendiente' | 'en_curso' | 'terminado') => {
    if (!sprintActiva || !sprintActiva.tareas) return [];
    return sprintActiva.tareas.filter(tarea => tarea.estado === estado);
  };

  const moverTarea = async (tarea: ITarea, nuevoEstado: 'pendiente' | 'en_curso' | 'terminado') => {
    if (!sprintActiva || !sprintActiva.id) return;
    
    const tareaActualizada = { ...tarea, estado: nuevoEstado };
    console.log("Moviendo tarea:", tareaActualizada);

    try {
      await putTareaEditar(tareaActualizada, false);
      
      if (sprintActiva && sprintActiva.tareas) {
        const tareasActualizadas = sprintActiva.tareas.map(t => 
          t.id === tarea.id ? tareaActualizada : t
        );
        
        const sprintActualizado = {
          ...sprintActiva,
          tareas: tareasActualizadas
        };
        
        sprintStore.getState().setSprintActiva(sprintActualizado);
      }
      
      console.log(`Tarea actualizada a estado: ${nuevoEstado}`);
    } catch (error) {
      console.error("Error al mover tarea:", error);
    }
  };

  const enviarAlBacklog = async (tarea: ITarea) => {
    if (!sprintActiva || !sprintActiva.id) return;
    
    console.log("Enviando tarea al backlog:", tarea);
  
    try {
      await removeTaskFromSprint(sprintActiva.id, tarea.id, true);
      
      if (sprintActiva && sprintActiva.tareas && tarea.id) {
        const tareasActualizadas = sprintActiva.tareas.filter(t => t.id !== tarea.id);
        
        const sprintActualizado = {
          ...sprintActiva,
          tareas: tareasActualizadas
        };
        
        sprintStore.getState().setSprintActiva(sprintActualizado);
      }
      
      const backlogTasks = await getAllBacklogTasks();
      setArrayTareas(backlogTasks);
      
      Swal.fire("Completado", "La tarea se envió al backlog correctamente", "success");
      
      console.log("Tarea enviada al backlog");
    } catch (error) {
      console.error("Error al enviar tarea al backlog:", error);
    }
  };

  const handleVerTarea = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setModoVisualizacion(true);
    setIsModalOpen(true);
  };
  
  const handleEditar = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setModoVisualizacion(false);
    setIsModalOpen(true);
  };
  
  const handleEliminar = async (tarea: ITarea) => {
    if (!tarea.id || !sprintActiva || !sprintActiva.id) {
      console.error("ID de tarea o sprint inválido");
      return;
    }
    
    try {
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
  
      if (!confirm.isConfirmed) return;
      
      await sprintStore.getState().eliminarUnaSprint(tarea.id);
      
      await removeTaskFromSprint(sprintActiva.id, tarea.id, false);
      
      if (sprintActiva && sprintActiva.tareas) {
        const tareasActualizadas = sprintActiva.tareas.filter(t => t.id !== tarea.id);
        
        const sprintActualizado = {
          ...sprintActiva,
          tareas: tareasActualizadas
        };
        
        sprintStore.getState().setSprintActiva(sprintActualizado);
        
        await sprintStore.getState().editarUnaSprint(sprintActualizado);
      }
      
      Swal.fire("Eliminado", "La tarea se eliminó correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar tarea del sprint:", error);
      Swal.fire("Error", "No se pudo eliminar la tarea", "error");
    }
  };

  const renderTarea = (tarea: ITarea) => {
    return (
      <div key={tarea.id} className={`${styles.taskRow} ${esFechaProxima(tarea.fechaLimite) ? styles.taskUrgent : ''}`}
      >
        <span className={styles.taskTitle}>{tarea.titulo}</span>
        <div className={styles.taskIcons}>

        <button 
          onClick={() => enviarAlBacklog(tarea)} 
          className={styles.moveBacklog} 
          title="Enviar al Backlog"
        >
          Enviar al Backlog
        </button>

          {tarea.estado === 'pendiente' && (
            <button 
              onClick={() => moverTarea(tarea, 'en_curso')} 
              className={styles.moveButton}
              title="Mover a En Curso"
            >
              <span className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  color: 'orange',
                  transition: 'color 0.1s ease-in-out',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
              >
                arrow_forward
              </span>
            </button>
          )}
          
          {tarea.estado === 'en_curso' && (
            <>
              <button 
                onClick={() => moverTarea(tarea, 'pendiente')} 
                className={styles.moveButton}
                title="Mover a Pendiente"
              >
                <span className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  color: 'orange',
                  transition: 'color 0.1s ease-in-out',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
              >
                  arrow_back
                </span>
              </button>
              
              <button 
                onClick={() => moverTarea(tarea, 'terminado')} 
                className={styles.moveButton}
                title="Mover a Terminado"
              >
                <span className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  color: 'orange',
                  transition: 'color 0.1s ease-in-out',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
              >
                arrow_forward
              </span>
              </button>
            </>
          )}
          
          {tarea.estado === 'terminado' && (
            <button 
              onClick={() => moverTarea(tarea, 'en_curso')} 
              className={styles.moveButton}
              title="Mover a En Curso"
            >
              <span className="material-symbols-outlined"
                style={{
                  fontSize: '24px',
                  color: 'orange',
                  transition: 'color 0.1s ease-in-out',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#5076f1')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'orange')}
              >
                  arrow_back
                </span>
            </button>
          )}
          
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
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'white')}>
                    edit
              </span>
          </button>
          
          <button
            onClick={() => handleEliminar(tarea)}
            className={styles.iconButton}
          >
            <span
                className="material-symbols-outlined"
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
    );
  };

  return (
    <>
      {sprintActiva ? (
        <div className={styles.taskTable}>
          <div className={styles.columnContainer}>
            
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <h3>Pendiente</h3>
              </div>
              <div className={styles.columnContent}>
                {getTareasFiltradas('pendiente').map(tarea => renderTarea(tarea))}
                {getTareasFiltradas('pendiente').length === 0 && (
                  <div className={styles.emptyMessage}>No hay tareas pendientes</div>
                )}
              </div>
            </div>
            
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <h3>En curso</h3>
              </div>
              <div className={styles.columnContent}>
                {getTareasFiltradas('en_curso').map(tarea => renderTarea(tarea))}
                {getTareasFiltradas('en_curso').length === 0 && (
                  <div className={styles.emptyMessage}>No hay tareas en curso</div>
                )}
              </div>
            </div>
            
            <div className={styles.column}>
              <div className={styles.columnHeader}>
                <h3>Terminado</h3>
              </div>
              <div className={styles.columnContent}>
                {getTareasFiltradas('terminado').map(tarea => renderTarea(tarea))}
                {getTareasFiltradas('terminado').length === 0 && (
                  <div className={styles.emptyMessage}>No hay tareas terminadas</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noSprintSelected}>
          <p>Selecciona un sprint para ver las tareas</p>
        </div>
      )}
      
      {isModalOpen && (
        <Modal
          handleCloseModal={() => {
            setIsModalOpen(false);
            setModoVisualizacion(false); 
          }}
          modoVisualizacion={modoVisualizacion}
          isSprintTask={true} 
        />
      )}
    </>
  );
};

export default ListaTareasSprint;