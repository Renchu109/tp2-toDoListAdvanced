import React, { useState, useEffect } from 'react';
import styles from './ListaTareas.module.css';
import { tareaStore } from '../../../store/tareaStore';
import { ITarea } from '../../../types/iTareas';
import { Modal } from '../Modal/Modal';
import { useTareas } from '../../../hooks/useTareas';

const ListaTareas: React.FC = () => {
  const tareas = tareaStore((state) => state.tareas);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);
  const { eliminarTarea } = useTareas();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Agregamos un log para verificar las tareas al renderizar
  useEffect(() => {
    console.log("Tareas actuales en ListaTareas:", tareas);
  }, [tareas]);

  const handleVerTarea = (tarea: ITarea) => {
    setTareaActiva(tarea); // Guarda la tarea activa
    setIsModalOpen(true);  // Abre el modal de detalles
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
    
    // Verificamos que la tarea existe
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
      </div>
      {tareas.map((tarea) => (
        <div key={tarea.id} className={styles.taskRow}>
          <span>{tarea.titulo}</span>
          <span>{tarea.descripcion}</span>
          <div className={styles.taskIcons}>
            <button onClick={() => handleVerTarea(tarea)} className={styles.iconButton}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button
              onClick={() => handleEditar(tarea)}
              className={styles.iconButton}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        </div>
      ))}
      {isModalOpen && <Modal handleCloseModal={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default ListaTareas;