import { useCallback, useState } from "react";
import { useHistory } from "react-router-dom";
import { Event } from "../constants/event";
import { useDispatch, useListener } from "../effects/use-event";
import useQueryParams from "../effects/use-query-params";
import { alertConfirm } from "../util/confirm-alert";

function TodoList() {
  const [todoLists, setTodoLists] = useState([
    { id: 1, name: "Shopping list" },
    { id: 2, name: "Trip packing" },
    { id: 3, name: "School work" },
  ]);

  const history = useHistory();
  const query = useQueryParams();
  const dispatcher = useDispatch();
  useListener(
    Event.LIST_UPDATED,
    useCallback(
      (listId, listName) => {
        setTodoLists(
          todoLists.map((list) => {
            if (list.id == listId) {
              list.name = listName;
            }
            return { ...list };
          })
        );
      },
      [todoLists]
    )
  );

  useListener(
    Event.LIST_CREATED,
    useCallback(
      (list) => {
        // todo: remove once api calls are ready
        if (todoLists.length > 0) {
          list.id = parseInt(todoLists[todoLists.length - 1].id, 10) + 1;
        } else {
          list.id = 1;
        }
        setTodoLists(todoLists.concat(list));
      },
      [todoLists]
    )
  );

  function onDeleteConfirmed(listId, onClose) {
    setTodoLists(todoLists.filter((list) => list.id != listId));
    dispatcher(Event.LIST_DELETED, listId);
    if (listId == query.listId) {
      history.push("/");
    }
    onClose();
  }

  function onDeleteClicked(e, listId) {
    e.preventDefault();
    e.stopPropagation();
    alertConfirm((onClose) => onDeleteConfirmed(listId, onClose));
  }

  function onItemSelected(itemId) {
    history.push({
      pathname: "/",
      search: `?listId=${encodeURIComponent(itemId)}`,
    });
  }

  return (
    <div className="px-4">
      {todoLists.length === 0 ? (
        <p className="mt-4 text-sm text-gray-500">
          No lists found. Please create one.
        </p>
      ) : (
        <>
          <div className="relative">
            <input
              className="pl-9 pt-2 pb-2 border-b border-solid rounded-full w-full outline-none"
              placeholder="Search"
            />
            <i className="fas fa-search absolute left-3 top-3"></i>
          </div>
          <ul className="mt-4">
            {todoLists.map((item) => {
              return (
                <li
                  key={item.id}
                  title={item.name}
                  className={`group flex gap-2 items-start transition-all duration-200 ease-linear overflow-hidden whitespace-nowrap overflow-ellipsis mt-2 pl-4 pr-1 py-2 text-md cursor-pointer border-2 border-transparent rounded-3xl border-solid hover:border-green-400 ${
                    item.id == query.listId
                      ? "hover:border-green-400 bg-green-400 text-white"
                      : ""
                  }`}
                  onClick={() => onItemSelected(item.id)}
                >
                  <p className="flex-grow whitespace-nowrap overflow-ellipsis overflow-hidden">
                    {item.name}
                  </p>
                  <div className="flex-grow-0 flex-shrink-0 w-6 h-6 self-center transform translate-x-7 transition-all group-hover:translate-x-0">
                    <a href="#" onClick={(e) => onDeleteClicked(e, item.id)}>
                      <i className={"fas fa-trash text-red-800"}></i>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
export default TodoList;
