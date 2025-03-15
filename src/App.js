import AllTasks from './AllTasks';
import './styles/App.css';
import { useState } from 'react';

function App() {

  const [taskName, setTaskName] = useState("");

  // submit new task
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ task_name: taskName }),
        mode: 'cors' 
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error adding task:', error);
    }
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
          <input type='submit' />
        </form>
      </div>
      <AllTasks
      handleSubmit={handleSubmit}
      />
    </div>
  );
}

export default App;
