import React, { useState } from "react";
import styles from "./Header.module.css";
import { Modal } from "../Modal/Modal";

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.backlogHeader}>
      <span>Tareas en backlog</span>
      <button className={styles.createTaskButton} onClick={openModal}>
        Crear tarea
      </button>
      {isModalOpen && <Modal handleCloseModal={closeModal} />}
    </div>
  );
};

export default Header;
