import AllTasks from './AllTasks';
import './styles/App.scss';
import { useState } from 'react';

function App() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [taskName, setTaskName] = useState("");

  // submit new task
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task_name: taskName }),
        mode: 'no-cors'
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error adding task:', error);
    }
    setTaskName("")
  };
  

  return (
    <div className="App">
      <h1>TO DO or NOT TO DO</h1>
      <div className='inputs-wrapper'>
        <form onSubmit={handleSubmit}>
          <label>
            New Task: 
            <input 
              type='text' 
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </label>
          <input type='submit' value="Add Task" />
        </form>
      </div>
      <AllTasks
      handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
