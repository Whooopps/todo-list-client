import TodoList from "../todo-list/TodoList";

function Sidebar() {
    return (
        <div className="flex-grow-0 flex-shrink-0 w-sidebar shadow-lg">
            <h1 className="py-2.5 text-xl font-bold text-center border-solid border-b border-gray-100">My Lists</h1>
            <div className="text-center mt-2">
                <button className="bg-green-500 text-white rounded text-center px-5 py-1.5"><i className="fas fa-plus mr-2"></i>Create List</button>
            </div>
            <div className="mt-6">
                <TodoList/>
            </div>
        </div>
    );
}

export default Sidebar;