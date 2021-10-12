import { Fragment } from "react";
import TodoContent from "../todo-content/TodoContent";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";
import { useAuthProtected } from "../effects/use-auth";

function Home() {
  useAuthProtected();
  return (
    <Fragment>
      <Sidebar />
      <div className="flex flex-col flex-grow align-center">
        <Header />
        <TodoContent />
      </div>
    </Fragment>
  );
}
export default Home;
