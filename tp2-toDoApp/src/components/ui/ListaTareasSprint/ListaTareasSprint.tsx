import React, { useState } from 'react';
import styles from './ListaTareasSprint.module.css';
import { tareaStore } from '../../../store/tareaStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';
import { sprintStore } from '../../../store/sprintStore';

const ListaTareasSprint: React.FC = () => {
  const tareas = tareaStore((state) => state.tareas);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);
  const actualizarTarea = tareaStore((state) => state.actualizarTarea);
  const sprintActiva = sprintStore((state) => state.sprintActiva);
  const { eliminarTarea } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTareasFiltradas = (estado: 'pendiente' | 'en_curso' | 'terminado') => {
    return tareas.filter(tarea => 
      tarea.sprintId === sprintActiva?.id && 
      tarea.estado === estado
    );
  };

  const moverTarea = (tarea: ITarea, nuevoEstado: 'pendiente' | 'en_curso' | 'terminado') => {
    const tareaActualizada = { ...tarea, estado: nuevoEstado };
    actualizarTarea(tareaActualizada);
  };

  const handleVerTarea = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setIsModalOpen(true);
  };
  
  const handleEditar = (tarea: ITarea) => {
    setTareaActiva(tarea);
    setIsModalOpen(true);
  };

  const handleEliminar = (idTarea: string) => {
    console.log("Eliminando tarea con ID:", idTarea);
    if (!idTarea) {
      console.error("ID de tarea inválido");
      return;
    }
    eliminarTarea(idTarea);
  };

  const renderTarea = (tarea: ITarea) => {
    return (
      <div key={tarea.id} className={styles.taskRow}>
        <span className={styles.taskTitle}>{tarea.titulo}</span>
        <div className={styles.taskIcons}>

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
            onClick={() => {
              if (tarea.id) {
                handleEliminar(tarea.id);
              }
            }}
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
      
      {isModalOpen && <Modal handleCloseModal={() => setIsModalOpen(false)} />}
    </>
  );
};

export default ListaTareasSprint;