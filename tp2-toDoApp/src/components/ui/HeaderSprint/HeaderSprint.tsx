import React, { useState } from "react";
import styles from "./HeaderSprint.module.css";
import { Modal } from "../Modal/Modal";

const HeaderSprint: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    
    <div className={styles.backlogHeader}>
      <h1 className={styles.mainTitle}><span>Sprint</span></h1>
      <span>Tareas en backlog</span>
      <button className={styles.createTaskButton} onClick={openModal}>
        Crear tarea
      </button>
      {isModalOpen && <Modal handleCloseModal={closeModal} />}
    </div>
  );
};

export default HeaderSprint;
