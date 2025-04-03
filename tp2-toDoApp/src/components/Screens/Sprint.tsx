import React from 'react';
import styles from './Sprint.module.css';
import HeaderSprint from '../ui/HeaderSprint/HeaderSprint';
import ListaTareasSprint from '../ui/ListaTareasSprint/ListaTareasSprint';
import SelectedSprintList from '../ui/SelectedSprintList/SelectedSprintList';

const Sprint: React.FC = () => {
    
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