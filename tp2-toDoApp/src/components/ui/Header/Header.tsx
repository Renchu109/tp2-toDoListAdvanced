import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <div className={styles.backlogHeader}>
      <span>Tareas en backlog</span>
      <button className={styles.createTaskButton}>Crear tarea</button>
    </div>
  );
};

export default Header;