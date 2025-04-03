import React, { useState, useEffect } from 'react';
import styles from './ListaTareas.module.css';
import { tareaStore } from '../../../store/tareaStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';
import { sprintStore } from '../../../store/sprintStore';

const ListaTareas: React.FC = () => {
  const tareas = tareaStore((state) => state.tareas);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);
  const sprints = sprintStore((state) => state.sprints);
  const { eliminarTarea } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Tareas actuales en ListaTareas:", tareas);
  }, [tareas]);

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
    

    const tarea = tareas.find(t => t.id === idTarea);
    if (!tarea) {
      console.error("No se encontró la tarea con ID:", idTarea);
      return;
    }
    
    eliminarTarea(idTarea);
  };

  return (
    <div className={styles.taskTable}>
      <div className={styles.taskHeader}>
        <span>Título</span>
        <span>Descripción</span>
        <span>Sprint</span>
      </div>
      {tareas.map((tarea) => {
        const sprintTitulo = tarea.sprintId 
        ? sprints.find(s => s.id === tarea.sprintId)?.titulo || "Sin asignar"
        : "Sin asignar";   
        return(     
        <div key={tarea.id} className={styles.taskRow}>
          <span>{tarea.titulo}</span>
          <span>{tarea.descripcion}</span>
          <span>{sprintTitulo}</span>
          <div className={styles.taskIcons}>
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
            <button
              onClick={() => handleEditar(tarea)}
              className={styles.iconButton}
            >
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
                  console.log(`Clic en eliminar tarea: ${tarea.id} - ${tarea.titulo}`);
                  handleEliminar(tarea.id);
                } else {
                  console.error("Tarea sin ID:", tarea);
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
      );})}
      {isModalOpen && <Modal handleCloseModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ListaTareas;