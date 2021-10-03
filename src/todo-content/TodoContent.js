import { useCallback, useEffect, useRef, useState } from "react";
import { Event } from "../constants/event";
import { useDispatch, useListener } from "../effects/use-event";
import useQueryParams from "../effects/use-query-params";
import TodoListItem from "../todo-list-item/TodoListItem";

function TodoContent() {
    const query = useQueryParams();
    const [items, setItems] = useState({
        1: {name: 'Shopping list', items: [ { id: 1, name: 'Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions', completed: false}, { id: 2, name: 'Gosht', completed: true }, { id: 3, name: 'Potatoes', completed: true} ]},
        2: {name: 'Trip packing', items: [ { id: 1, name: 'Clothes', completed: false}, { id: 2, name: 'Toothbrush', completed: true }, { id: 3, name: 'Food', completed: false} ]},
        3: {name: 'School work', items: [ { id: 1, name: 'Homework', completed: false}, { id: 2, name: 'Project', completed: false }, { id: 3, name: 'Journal update', completed: false} ]},
    });
    const headerRef = useRef();
    const [editingHeader, setEditingHeader] = useState(false);
    const [headerValue, setHeaderValue] = useState('');
    const eventDispatcher = useDispatch();
    useListener(Event.NEW_LIST_ITEM_ADDED, useCallback((item) => {
        if (items[query.listId]) {
            setItems({
                ...items,
                [query.listId]: {
                    ...items[query.listId],
                    items: items[query.listId].items.concat(item),
                }
            });
        }
    }, [items]));

    useEffect(() => {
        if (headerRef.current) {
            headerRef.current.focus();
            headerRef.current.select();
        }
    }, [editingHeader]);

    useEffect(() => {
        setHeaderValue(items[query.listId].name);
    }, [query.listId]);

    function cancelHeaderEditing() {
        setEditingHeader(false);
        setHeaderValue(items[query.listId].name);
    }

    function endHeaderEditing() {
        setEditingHeader(false);
        eventDispatcher(Event.LIST_UPDATED, query.listId, headerValue);
        // todo: make server request
    }

    function onKeyUp(e) {
        switch(e.key) {
            case 'Escape':
                cancelHeaderEditing();
                break;
            case 'Enter':
                endHeaderEditing();
                break;
        }
    }

    function renderItems(listId) {
        let newExpectedId = 1;
        return items[listId].items.map( (item) => {
            newExpectedId = item.id + 1;
            return <TodoListItem key={`${listId}-${item.id}`} {...item}/>
        }).concat(
            <TodoListItem key={`${listId}-${newExpectedId}`} id={newExpectedId} isNew={true} />
        );
    }

    return (
        <div className="flex flex-grow">
            <div className="flex-grow mt-10 px-44">
                {query.listId && items[query.listId] ? (
                    [
                        editingHeader ? 
                        (<input 
                            ref={headerRef} 
                            className="pb-2 bg-transparent border-b border-solid border-gray-300 w-full text-center text-3xl text-bold mb-8 outline-none"
                            value={headerValue} 
                            onChange={(e) => setHeaderValue(e.target.value)} 
                            onBlur={endHeaderEditing}
                            onKeyUp={onKeyUp}
                            />
                        ) :
                        (<h2 className="text-center text-3xl text-bold mb-8 pb-2 border-b border-transparent" onClick={() => setEditingHeader(true)}>{headerValue}</h2>),
                        renderItems(query.listId)
                    ]
                ): (
                    <p className="text-3xl text-center p-4 text-gray-500">
                        Select a list to display items!
                    </p>
                )}
            </div>
        </div>
    );
}

export default TodoContent;