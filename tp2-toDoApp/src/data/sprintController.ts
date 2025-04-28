import axios from "axios";
import { ISprint } from "../types/iSprints";
import { ITarea } from "../types/iTareas";
import { URL_SPRINT, URL_BACKLOG } from "../utils/constantes";

export const getAllSprints = async () => {
  try {
    const response = await axios.get(`${URL_SPRINT}/sprintList`);
    return response.data.sprints;
  } catch (error) {
    console.error("Error fetching sprints:", error);
    throw error;
  }
};

export const getSprintById = async (sprintId: string) => {
  try {
    const response = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprint = response.data.sprints.find((s: ISprint) => s.id === sprintId);
    if (!sprint) {
      throw new Error(`Sprint with ID ${sprintId} not found`);
    }
    return sprint;
  } catch (error) {
    console.error(`Error fetching sprint with ID ${sprintId}:`, error);
    throw error;
  }
};

export const createSprint = async (nuevaSprint: ISprint) => {
  try {
    const sprintWithTasks = {
      ...nuevaSprint,
      tareas: nuevaSprint.tareas || []
    };
    
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const updatedSprints = [...sprintListData.sprints, sprintWithTasks];
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    return sprintWithTasks;
  } catch (error) {
    console.error("Error creating sprint:", error);
    throw error;
  }
};

export const updateSprint = async (sprintActualizada: ISprint) => {
  try {
    if (!sprintActualizada.id) {
      throw new Error("No sprint ID provided for update");
    }

    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const updatedSprints = sprintListData.sprints.map((sprint: ISprint) => 
      sprint.id === sprintActualizada.id ? sprintActualizada : sprint
    );
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    return sprintActualizada;
  } catch (error) {
    console.error("Error updating sprint:", error);
    throw error;
  }
};

export const deleteSprint = async (idSprint: string) => {
  try {
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const sprintToDelete = sprintListData.sprints.find((sprint: ISprint) => sprint.id === idSprint);
    if (!sprintToDelete) {
      throw new Error(`Sprint with ID ${idSprint} not found`);
    }
    
    if (sprintToDelete.tareas && sprintToDelete.tareas.length > 0) {
      const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
      const backlogData = backlogResponse.data;
      
      const updatedBacklogTasks = [...backlogData.tareas, ...sprintToDelete.tareas];
      
      await axios.put(`${URL_BACKLOG}/backlog`, {
        ...backlogData,
        tareas: updatedBacklogTasks
      });
    }
    
    const updatedSprints = sprintListData.sprints.filter((sprint: ISprint) => sprint.id !== idSprint);
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting sprint:", error);
    throw error;
  }
};

export const getSprintTasks = async (sprintId: string) => {
  try {
    const sprint = await getSprintById(sprintId);
    return sprint.tareas || [];
  } catch (error) {
    console.error(`Error fetching tasks for sprint ${sprintId}:`, error);
    throw error;
  }
};

export const updateSprintTask = async (sprintId: string, tareaActualizada: ITarea) => {
  try {
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const updatedSprints = sprintListData.sprints.map((sprint: ISprint) => {
      if (sprint.id === sprintId) {
        const updatedTasks = sprint.tareas.map((tarea: ITarea) => 
          tarea.id === tareaActualizada.id ? tareaActualizada : tarea
        );
        return {
          ...sprint,
          tareas: updatedTasks
        };
      }
      return sprint;
    });
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    return tareaActualizada;
  } catch (error) {
    console.error(`Error updating task in sprint ${sprintId}:`, error);
    throw error;
  }
};

export const removeTaskFromSprint = async (sprintId: string, taskId: string, moveToBacklog: boolean = true) => {
  try {
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const sprint = sprintListData.sprints.find((s: ISprint) => s.id === sprintId);
    if (!sprint) {
      throw new Error(`Sprint with ID ${sprintId} not found`);
    }
    
    const taskToRemove = sprint.tareas.find((t: ITarea) => t.id === taskId);
    if (!taskToRemove) {
      throw new Error(`Task with ID ${taskId} not found in sprint ${sprintId}`);
    }
    
    const updatedSprints = sprintListData.sprints.map((s: ISprint) => {
      if (s.id === sprintId) {
        return {
          ...s,
          tareas: s.tareas.filter((t: ITarea) => t.id !== taskId)
        };
      }
      return s;
    });
    
    await axios.put(`${URL_SPRINT}/sprintList`, {
      ...sprintListData,
      sprints: updatedSprints
    });
    
    if (moveToBacklog) {
      const backlogResponse = await axios.get(`${URL_BACKLOG}/backlog`);
      const backlogData = backlogResponse.data;
      
      const updatedBacklogTasks = [...backlogData.tareas, taskToRemove];
      
      await axios.put(`${URL_BACKLOG}/backlog`, {
        ...backlogData,
        tareas: updatedBacklogTasks
      });
    }
    
    return true;
  } catch (error) {
    console.error(`Error removing task from sprint ${sprintId}:`, error);
    throw error;
  }
};

export const changeTaskStatus = async (sprintId: string, taskId: string, newStatus: 'pendiente' | 'en_curso' | 'terminado') => {
  try {
    const sprintListResponse = await axios.get(`${URL_SPRINT}/sprintList`);
    const sprintListData = sprintListResponse.data;
    
    const updatedSprints = sprintListData.sprints.map((sprint: ISprint) => {
      if (sprint.id === sprintId) {
        const updatedTasks = sprint.tareas.map((tarea: ITarea) => 
          tarea.id === taskId ? { ...tarea, estado: newStatus } : tarea
        );
        return {
          ...sprint,
          tareas: updatedTasks
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
    console.error(`Error changing task status in sprint ${sprintId}:`, error);
    throw error;
  }
};

export const getSingleSprint = async (sprintId: string) => {
  try {
      const response = await fetch(`/api/sprints/${sprintId}`);
      if (!response.ok) throw new Error('Error al cargar el sprint');
      
      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error al obtener el sprint:", error);
      throw error;
  }
};