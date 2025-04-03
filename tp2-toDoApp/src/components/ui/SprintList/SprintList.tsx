import React, { useEffect, useState } from 'react';
import styles from './SprintList.module.css';
import { ModalSprint } from '../Modal/ModalSprint';
import { ISprint } from '../../../types/iSprints';
import { useSprints } from '../../../hooks/useSprints';
import { sprintStore } from '../../../store/sprintStore';

const SprintList: React.FC = () => {

  const [isModalSprintOpen, setIsModalSprintOpen] = useState(false);
    const sprints = sprintStore((state) => state.sprints);
    const setSprintActiva = sprintStore((state) => state.setSprintActiva);
    const { eliminarSprint } = useSprints();
    const openModalSprint = () => setIsModalSprintOpen(true);
    const closeModalSprint = () => setIsModalSprintOpen(false);

    // Agregamos un log para verificar las sprints al renderizar
  useEffect(() => {
    console.log("Sprints actuales en ListaSprints:", sprints);
  }, [sprints]);

  const handleVerSprint = (sprint: ISprint) => {
    setSprintActiva(sprint); // Guarda la sprint activa
    setIsModalSprintOpen(true);  // Abre el modalSprint de detalles
  };
  
  const handleEditar = (sprint: ISprint) => {
    setSprintActiva(sprint);
    setIsModalSprintOpen(true);
  };

  const handleEliminar = (idSprint: string) => {
    console.log("Eliminando sprint con ID:", idSprint);
    if (!idSprint) {
      console.error("ID de sprint inválido");
      return;
    }
    
    // Verificamos que la sprint existe
    const sprint = sprints.find(t => t.id === idSprint);
    if (!sprint) {
      console.error("No se encontró la sprint con ID:", idSprint);
      return;
    }
    
    eliminarSprint(idSprint);
  };

  
  return (
    <div className={styles.sprintListContainer}>
      <div className={styles.sprintItem}>Backlog</div>
      <div className={styles.sprintItem}>Lista sprint
        <button className={styles.createTaskButton} onClick={openModalSprint}>
          Crear Sprint
        </button>
        
      </div>
      
      <div className={styles.sprintDetailsBox}>
        {sprints.map((sprint) => (
          <div key={sprint.id} className={styles.sprintDetailsRow}>
            <div className={styles.sprintDetailsRox}>
              <span>Título: </span>
              <span>{sprint.titulo}</span>
            </div>
            <div className={styles.sprintDetailsRox}>
              <span>Inicio: </span>
              <span>{sprint.fechaInicio}</span>
            </div>

            <div className={styles.sprintDetailsRox}>
              <span>Cierre: </span>
              <span>{sprint.fechaCierre}</span>
            </div>
            
            <div className={styles.sprintActionIcons}>
              <button onClick={() => handleVerSprint(sprint)} className={styles.iconButton}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">

                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
              <button
                onClick={() => handleEditar(sprint)}
                className={styles.iconButton}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </button>
              <button
                onClick={() => {
                  if (sprint.id) {
                    console.log(`Clic en eliminar sprint: ${sprint.id} - ${sprint.titulo}`);
                    handleEliminar(sprint.id);
                  } else {
                    console.error("Sprint sin ID:", sprint);
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
      </div>
      
      {isModalSprintOpen && <ModalSprint handleCloseModalSprint={closeModalSprint} />}
      {isModalSprintOpen && <ModalSprint handleCloseModalSprint={() => setIsModalSprintOpen(false)} />}

    </div>
  );
  
};

export default SprintList;