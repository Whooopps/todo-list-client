import { useState } from "react";

function TodoListItem({id, name, completed}) {
    const [checked, setChecked] = useState(completed);
    return (
        <div className="bg-white rounded px-3 py-5 w-full mb-4 shadow-sm">
            <div className="flex items-start">
                <input className="mr-4 w-6 h-6 flex-grow-0 flex-shrink-0 self-center outline-none" type="checkbox" checked={checked} onChange={() => setChecked(!checked)}/>
                <p className={`text-lg ${checked ? 'line-through' : ''}`}>{name}</p>
            </div>
        </div>
    );
}

export default TodoListItem;