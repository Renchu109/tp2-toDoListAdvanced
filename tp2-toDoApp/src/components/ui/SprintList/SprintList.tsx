import React from 'react';
import styles from './SprintList.module.css';

const SprintList: React.FC = () => {
  return (
    <div className={styles.sprintListContainer}>
      <div className={styles.sprintItem}>Backlog</div>
      <div className={styles.sprintItem}>Lista sprint</div>
      
      <div className={styles.sprintDetailsBox}>
        <div className={styles.sprintDetailsRow}>
          <span>Título:</span>
          <span>00/00/00</span>
        </div>
        <div className={styles.sprintDetailsRow}>
          <span>Inicio:</span>
          <span>00/00/00</span>
        </div>
        <div className={styles.sprintDetailsRow}>
          <span>Cierre:</span>
          <span>00/00/00</span>
        </div>
        <div className={styles.sprintActionIcons}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SprintList;