import React, { useState } from 'react';
import styles from './SelectedSprintList.module.css';
import { sprintStore } from '../../../store/sprintStore';
import { ModalSprint } from '../Modal/ModalSprint';
import { useSprints } from '../../../hooks/useSprints';
import { ISprint } from '../../../types/iSprints';
import { useNavigate } from 'react-router-dom';

const SprintList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sprints = sprintStore((state) => state.sprints);
  const setSprintActiva = sprintStore((state) => state.setSprintActiva);
  const sprintActiva = sprintStore((state) => state.sprintActiva);
  const { eliminarSprint } = useSprints();
  const navigate = useNavigate();

  const handleVerSprint = (sprint: ISprint) => {
    setSprintActiva(sprint);
  };

  const handleGoBack = () => {
      navigate('/');
    };

  const handleEditar = (sprint: ISprint) => {
    setSprintActiva(sprint);
    setIsModalOpen(true);
  };

  const handleEliminar = (id: string) => {
    if (sprintActiva && sprintActiva.id === id) {
      setSprintActiva(null);
    }
    eliminarSprint(id);
  };

  return (
    <div className={styles.sprintListContainer}>
      <div className={styles.sprintItem} >
        <span>Backlog</span>
        <button onClick={handleGoBack} className={styles.iconButton}>
        <span className="material-symbols-outlined">
          undo
        </span>
        </button>
      </div>
      <div className={styles.headerContainer}>
        <h2>Sprints</h2>
        <button 
          className={styles.createSprintButton} 
          onClick={() => {
            setSprintActiva(null); 
            setIsModalOpen(true);
          }}
        >
          + Nuevo Sprint
        </button>
      </div>

      <div className={styles.sprintList}>
        {sprints.map((sprint) => (
          <div 
            key={sprint.id} 
            className={`${styles.sprintItem} ${sprintActiva && sprintActiva.id === sprint.id ? styles.activeSprintItem : ''}`}
            onClick={() => handleVerSprint(sprint)}
          >
            <div className={styles.sprintInfo}>
              <div className={styles.sprintTitle}>{sprint.titulo}</div>
              <div className={styles.sprintDates}>
                Inicio: {new Date(sprint.fechaInicio).toLocaleDateString()} - Cierre: {new Date(sprint.fechaCierre).toLocaleDateString()}
              </div>
            </div>
            <div className={styles.sprintActions}>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  handleEditar(sprint);
                }}
                className={styles.iconButton}
              >
                <span className="material-symbols-outlined">
                  edit
              </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  if (sprint.id) {
                    handleEliminar(sprint.id);
                  }
                }}
                className={styles.iconButton}
              >
                <span
                className="material-symbols-outlined">
                delete
              </span>
              </button>
            </div>
          </div>
        ))}
        {sprints.length === 0 && (
          <div className={styles.noSprints}>No hay sprints creados</div>
        )}
      </div>

      {isModalOpen && (
        <ModalSprint handleCloseModalSprint={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default SprintList;