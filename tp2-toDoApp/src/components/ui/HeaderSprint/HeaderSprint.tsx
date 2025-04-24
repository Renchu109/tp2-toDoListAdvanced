import React, { useState } from "react";
import styles from "./HeaderSprint.module.css";
import { Modal } from "../Modal/Modal";
import { sprintStore } from "../../../store/sprintStore";

const HeaderSprint: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sprintActiva = sprintStore((state) => state.sprintActiva);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.backlogHeader}>
      <h1 className={styles.mainTitle}><span>Sprint</span></h1>
      <span>Tareas en backlog</span>
      <button 
        className={styles.createTaskButton} 
        onClick={openModal}
        disabled={!sprintActiva} 
        title={!sprintActiva ? "Selecciona un sprint primero" : "Crear tarea en este sprint"}
      >
        Crear tarea
      </button>
      {isModalOpen && <Modal 
        handleCloseModal={closeModal} 
        sprintSeleccionado={sprintActiva?.id || ''} 
      />}
    </div>
  );
};

export default HeaderSprint;