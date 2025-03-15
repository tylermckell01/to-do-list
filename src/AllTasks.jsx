import './styles/App.scss';
import { useState, useEffect } from 'react';


function AllTasks(handleSubmit) {
    const API_URL = process.env.REACT_APP_API_URL;

    const [allTasks, setAllTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editedTaskName, setEditedTaskName] = useState("");
    const [editedTaskStatus, setEditedTaskStatus] = useState("");
    const [taskOrder, setTaskOrder] = useState("");


    // fetch all tasks function
    const fetchTasks = () => {
        fetch(`${API_URL}/tasks`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("failed to fetch all tasks")
            }
            return response.json();
        })
        .then((data) => setAllTasks(data))
        .catch((error) => console.error("Error fetching tasks:", error));
    }

    // fetch all tasks on any task updates useeffect
    useEffect(() => {
        fetchTasks();
    }, [handleSubmit]);

    // Update task
    const updateTask = async () => {
    
        try {
            const response = await fetch(`${API_URL}/task/${editingTaskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    task_name: editedTaskName, 
                    task_status: editedTaskStatus
                }),
                // mode: 'no-cors'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to edit task: ${response.status} - ${errorText}`);
            }
    
            const updatedTask = await response.json();
            console.log("Task edited successfully:", updatedTask);
    
            fetchTasks()
    
        } catch (error) {
            console.error("Error editing task:", error);
        }
    };
    
    // Delete task
    const deleteTask = async (taskId) => {
        console.log(taskId)
    
        try {
            const response = await fetch(`${API_URL}/task/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                // mode: 'no-cors'
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to delete task: ${response.status} - ${errorText}`);
            }
    
            console.log("Task deleted successfully");
    
            fetchTasks()
    
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // on edit button click
    const handleEditClick = (task) => {
        setEditingTaskId(task.task_id);
        setEditedTaskName(task.task_name);
        setEditedTaskStatus(task.task_status);
    };

    // on save button click
    const handleSaveClick = () => {
        updateTask();
        setEditingTaskId(null);
    };

    // filter function
    const filterTasks = (e) => {
        setTaskOrder(e.target.value);
        (console.log(allTasks));

    }
    const filteredTasks = 
        taskOrder === "All Tasks"
        ? allTasks
        : allTasks.filter((task) => 
            task.task_status.toLowerCase().includes(taskOrder.toLowerCase())
        );

    

  return (
    <div className="App">
        <h1>Here are all your tasks</h1>
        <select value={taskOrder} onChange={(e) => filterTasks(e)}>
            <option value="All Tasks">All Tasks</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Complete">Complete</option>
        </select>
        <ul>
            {filteredTasks.map(task => (
                <li key={task.task_id}>
                {editingTaskId === task.task_id ? (
                    <>
                        <input
                            type="text"
                            value={editedTaskName}
                            onChange={(e) => setEditedTaskName(e.target.value)}
                        />
                        <select value={editedTaskStatus} onChange={(e) => setEditedTaskStatus(e.target.value)}>
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Complete">Complete</option>
                        </select>
                        <button onClick={() => handleSaveClick(editingTaskId)}>Save</button>
                        <button onClick={() => setEditingTaskId(null)}>Cancel</button>
                    </>
                ) : (
                    <>
                        {task.task_name} - <strong>{task.task_status}</strong>
                        <button onClick={() => handleEditClick(task)}>Edit</button>
                        <button onClick={() => deleteTask(task.task_id)}>Delete</button>
                    </>
                )}
            </li>
            ))}
        </ul>
    </div>
  );
}

export default AllTasks;
