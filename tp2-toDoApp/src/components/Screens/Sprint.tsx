import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Sprint.module.css';
import HeaderSprint from '../ui/HeaderSprint/HeaderSprint';
import ListaTareasSprint from '../ui/ListaTareasSprint/ListaTareasSprint';
import SelectedSprintList from '../ui/SelectedSprintList/SelectedSprintList';
import { sprintStore } from '../../store/sprintStore';
import { useSprints } from '../../hooks/useSprints';

const Sprint: React.FC = () => {
  const { sprintId } = useParams<{ sprintId: string }>();
  const { sprints, getSprints } = useSprints();
  const setSprintActiva = sprintStore((state) => state.setSprintActiva);
  const sprintActiva = sprintStore((state) => state.sprintActiva);
  
  useEffect(() => {
    if (sprints.length === 0) {
      getSprints();
    }
  }, [getSprints, sprints.length]);
  
  useEffect(() => {
    if (sprintId && sprints.length > 0) {
      const sprintEncontrada = sprints.find(sprint => sprint.id === sprintId);
      if (sprintEncontrada && (!sprintActiva || sprintActiva.id !== sprintId)) {
        setSprintActiva(sprintEncontrada);
      }
    }
  }, [sprintId, sprints, setSprintActiva, sprintActiva]);
  
  return (
    <div className={styles.sprintContainer}>
      <div className={styles.sidebar}>
        <h1>Administrador de tareas</h1>
        <SelectedSprintList />
      </div>
      <div className={styles.mainContent}>
        <HeaderSprint />
        <ListaTareasSprint />
      </div>
    </div>
  );
};

export default Sprint;