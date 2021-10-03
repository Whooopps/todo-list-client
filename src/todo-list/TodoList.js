import { useState } from "react";
import { useHistory } from "react-router-dom";
import useQueryParams from "../effects/use-query-params";

function TodoList() {
    const [todoLists, setTodoLists] = useState([
        { id: 1, name: 'Shopping list' },
        { id: 2, name: 'Trip packing' },
        { id: 3, name: 'School work' },
    ]);

    const history = useHistory();
    const query = useQueryParams();
    const [selectedItemId, setSelectedItemId] = useState(parseInt(query.listId, 10));    

    function onItemSelected(itemId) {
        setSelectedItemId(itemId);
        history.push({
            pathname: '/',
            search: `?listId=${encodeURIComponent(itemId)}`
        });
    }

    return (
        <div className="px-4">
            <div className="relative">
                <input className="pl-9 pt-2 pb-2 border-b border-solid rounded-full w-full outline-none" placeholder="Search" />
                <i className="fas fa-search absolute left-3 top-3"></i>
            </div>
            <ul className="mt-4">
                {todoLists.map((item) => {
                    return <li
                            key={item.id}
                            title={item.name} 
                            className={`transition-all duration-200 ease-linear overflow-hidden whitespace-nowrap overflow-ellipsis mt-2 px-4 py-2 text-lg cursor-pointer border-2 border-transparent rounded-3xl border-solid hover:border-green-400 ${item.id === selectedItemId ? 'hover:border-green-400 bg-green-400 text-white' : ''}`}
                            onClick={() => onItemSelected(item.id)}
                        >{item.name}</li>;
                })}
            </ul>
        </div>
    );
}
export default TodoList;