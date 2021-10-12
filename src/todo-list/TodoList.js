import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { Event } from "../constants/event";
import { useAuthProtected } from "../effects/use-auth";
import { useAxios } from "../effects/use-axios";
import { useDispatch, useListener } from "../effects/use-event";
import useQueryParams from "../effects/use-query-params";
import { Loader } from "../loader/Loader";
import { alertConfirm } from "../util/confirm-alert";

function TodoList() {
  const axios = useAxios();
  const [isLoading, setIsLoading] = useState(true);
  const [todoLists, setTodoLists] = useState([]);
  const [filteredTodoLists, setFilteredTodoLists] = useState([]);
  const [searchText, setSearchText] = useState("");
  const deletingRef = useRef(false);

  const history = useHistory();
  const query = useQueryParams();
  const dispatcher = useDispatch();
  const isAuthenticated = useAuthProtected();

  useEffect(async () => {
    if (!isAuthenticated) return;
    try {
      setIsLoading(true);
      const response = await axios.get("/api/v1/todo-list");
      setTodoLists(response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

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

  useEffect(() => {
    setFilteredTodoLists(
      todoLists.filter((list) =>
        list.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [todoLists, searchText]);

  useListener(
    Event.LIST_CREATED,
    useCallback(
      (list) => {
        setTodoLists((todoLists) => todoLists.concat(list));
      },
      [todoLists]
    )
  );

  async function onDeleteConfirmed(listId, onClose) {
    if (deletingRef.current) return;
    try {
      deletingRef.current = true;
      await axios.delete(`/api/v1/todo-list/${listId}`);
      setTodoLists(todoLists.filter((list) => list.id != listId));
      dispatcher(Event.LIST_DELETED, listId);
      if (listId == query.listId) {
        history.push("/");
      }
    } catch (e) {
      console.log(e);
    } finally {
      deletingRef.current = false;
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

  function renderNoData() {
    return (
      <p className="mt-4 text-sm text-gray-500">
        No lists found. Please create one.
      </p>
    );
  }
  function renderList() {
    return (
      <>
        <div className="relative">
          <input
            className="pl-9 pt-2 pb-2 border-b border-solid rounded-full w-full outline-none"
            placeholder="Search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-3"></i>
        </div>
        <ul className="mt-4">
          {filteredTodoLists.map((item) => {
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
    );
  }

  return (
    <div className="px-4">
      {isLoading ? (
        <div className="text-center">
          <Loader />
        </div>
      ) : todoLists.length === 0 ? (
        renderNoData()
      ) : (
        renderList()
      )}
    </div>
  );
}
export default TodoList;
