import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut"

function App() {
  return (
    <>
      <Unauthenticated> 
        <SignIn />
      </Unauthenticated>
      <Authenticated>  
        <SignOut />
        <Content />
      </Authenticated>
    </>
  );
}

function Content() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
    </div>
  );
}

export default App;

