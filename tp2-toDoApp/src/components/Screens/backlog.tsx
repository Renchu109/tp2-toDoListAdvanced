import React from 'react';
import styles from './Backlog.module.css';
import Header from '../ui/Header/Header';
import SprintList from '../ui/SprintList/SprintList';
import ListaTareas from '../ui/ListaTareas/ListaTareas';

const Backlog: React.FC = () => {

  

  return (
    
    <div className={styles.backlogContainer}>
      <div className={styles.sidebar}>
        <h1>Administrador de tareas</h1>
        <SprintList />
      </div>
      <div className={styles.mainContent}>
        <Header />
        <ListaTareas />
      </div>
    </div>
  );
};

export default Backlog;