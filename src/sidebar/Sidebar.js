import { useState } from "react";
import { useHistory } from "react-router";
import { Event } from "../constants/event";
import { useDispatch } from "../effects/use-event";
import TodoList from "../todo-list/TodoList";

function Sidebar() {
    const [isCreatingList, setIsCreatingList] = useState(false);
    const dispatcher = useDispatch();
    const history = useHistory();
    function createList() {
        setIsCreatingList(true);
        // fake api delay
        // todo: replace with server call
        setTimeout(() => {
            const newList = {
                id: 4,
                name: 'New list',
            };
            dispatcher(Event.LIST_CREATED, newList);
            history.push({
                pathname: '/',
                search: `?listId=${encodeURIComponent(newList.id)}`,
                state: {
                    isNew: true
                },
            });
            setIsCreatingList(false);
        }, 500);
    }

    return (
        <div className="flex-grow-0 flex-shrink-0 w-sidebar shadow-lg">
            <h1 className="py-2.5 text-xl font-bold text-center border-solid border-b border-gray-100">My Lists</h1>
            <div className="text-center mt-2">
                <button className={"bg-green-500 text-white rounded text-center px-5 py-1.5 disabled:bg-green-200" } onClick={createList} disabled={isCreatingList}><i className="fas fa-plus mr-2"></i>Create List</button>
            </div>
            <div className="mt-6">
                <TodoList/>
            </div>
        </div>
    );
}

export default Sidebar;