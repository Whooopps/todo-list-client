import { Fragment } from "react";
import TodoContent from "../todo-content/TodoContent";
import Sidebar from "../sidebar/Sidebar";
import Header from "../header/Header";

function Home() {
    return (
        <Fragment>
            <Sidebar/>
            <div className="flex flex-col flex-grow align-center">
                <Header/>
                <TodoContent/>
            </div>
        </Fragment>
    );
}
export default Home;