import axios from "axios";
import { ITarea } from "../types/iTareas";
import { URL_BACKLOG, URL_SPRINT } from "../utils/constantes";

export const getAllBacklogTasks = async () => {
  try {
    const response = await axios.get(`${URL_BACKLOG}/backlog`);
    return response.data.tareas;
  } catch (error) {
    console.error("Error fetching backlog tasks:", error);
    throw error;
  }
};

export const addTaskToBacklog = async (nuevaTarea: ITarea) => {
  try {
    const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
    const backlogData = backlogResponse.data;
    
    const updatedTasks = [...backlogData.tareas, nuevaTarea];
    
    await axios.put(`${URL_BACKLOG}/backlog`, {
      ...backlogData,
      tareas: updatedTasks
    });
    
    return nuevaTarea;
  } catch (error) {
    console.error("Error adding task to backlog:", error);
    throw error;
  }
};

export const updateBacklogTask = async (tareaActualizada: ITarea) => {
  try {
    if (!tareaActualizada.id) {
      throw new Error("No task ID provided for update");
    }
    
    const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
    const backlogData = backlogResponse.data;
    
    const updatedTasks = backlogData.tareas.map((tarea: ITarea) => 
      tarea.id === tareaActualizada.id ? tareaActualizada : tarea
    );
    
    await axios.put(`${URL_BACKLOG}/backlog`, {
      ...backlogData,
      tareas: updatedTasks
    });
    
    return tareaActualizada;
  } catch (error) {
    console.error("Error updating backlog task:", error);
    throw error;
  }
};

export const deleteBacklogTask = async (idTarea: string) => {
  try {
    const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
    const backlogData = backlogResponse.data;
    
    const updatedTasks = backlogData.tareas.filter((tarea: ITarea) => tarea.id !== idTarea);
    
    await axios.put(`${URL_BACKLOG}/backlog`, {
      ...backlogData,
      tareas: updatedTasks
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting backlog task:", error);
    throw error;
  }
};

export const moveTaskToSprint = async (idTarea: string, sprintId: string) => {
  try {
    const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
    const backlogData = backlogResponse.data;
    
    const taskToMove = backlogData.tareas.find((tarea: ITarea) => tarea.id === idTarea);
    if (!taskToMove) {
      throw new Error(`Task with ID ${idTarea} not found`);
    }
    
    const updatedBacklogTasks = backlogData.tareas.filter((tarea: ITarea) => tarea.id !== idTarea);
    
    await axios.put(`${URL_BACKLOG}/backlog`, {
      ...backlogData,
      tareas: updatedBacklogTasks
    });
    
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const updatedSprints = sprintListData.sprints.map((sprint: any) => {
      if (sprint.id === sprintId) {
        return {
          ...sprint,
          tareas: [...(sprint.tareas || []), taskToMove]
        };
      }
      return sprint;
    });
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    return true;
  } catch (error) {
    console.error("Error moving task to sprint:", error);
    throw error;
  }
};