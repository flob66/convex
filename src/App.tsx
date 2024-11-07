import "./App.css";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut"
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";

function App() {
  return (
    <>
      <Unauthenticated> 
        <SignIn />
      </Unauthenticated>
      <Authenticated>  
        <SignOut />
        <br></br>
        <br></br>
        <Content />
        <br></br>
        <Create />
        <br></br>
      </Authenticated>
    </>
  );
}

function Content() {
  const tasks = useQuery(api.tasks.get);
  const remove = useMutation(api.tasks.deleteTask);
  const updateTask = useMutation(api.tasks.updateTask);

  const handleUpdateTask = async (id: Id<"tasks">, text: string, isCompleted: boolean) => {
    await updateTask({ id, text, isCompleted: !isCompleted });
  };

  const handleDeleteTask = async (id: Id<"tasks">) => {
    await remove({ id });
  };
  return (
    <div className="App">
      <ul>
        {tasks?.map(({ _id, text, isCompleted }) => 
        <li>            
            <span
              style={{
                textDecoration: isCompleted ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => handleUpdateTask(_id, text, isCompleted)}
              key={_id}
            >
              {text}
            </span>
            <button onClick={() => handleDeleteTask(_id)} style={{ marginLeft: "10px" }}>
              Delete
            </button>
        </li>)}
      </ul>
    </div>
  );
}

function Create(){
  const [newTaskText, setNewTaskText] = useState<string>("");
  const [newIsCompleted, setNewIsCompleted] = useState<boolean>(false);
  const create = useMutation(api.tasks.createTask);

  const handleCreateTask = async () => {
    if (newTaskText.trim()) {
      await create({ text: newTaskText, isCompleted: newIsCompleted });
      setNewIsCompleted(false);
    }
  };

  return(
    <div>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
  );
}

export default App;

