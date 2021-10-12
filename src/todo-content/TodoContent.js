import { CancelToken } from "axios";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Event } from "../constants/event";
import { useAuthProtected } from "../effects/use-auth";
import { useAxios } from "../effects/use-axios";
import { useEditable } from "../effects/use-editable";
import { useDispatch, useListener } from "../effects/use-event";
import useQueryParams from "../effects/use-query-params";
import { Loader } from "../loader/Loader";
import TodoListItem from "../todo-list-item/TodoListItem";
import { alertConfirm } from "../util/confirm-alert";

function TodoContent() {
  const axios = useAxios();
  const query = useQueryParams();
  const location = useLocation();
  const [listName, setListName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  const deleteRef = useRef(false);
  const isAuthenticated = useAuthProtected();

  const currentListId = parseInt(query.listId, 10);

  const {
    isEditing: editingHeader,
    ref: headerRef,
    value: headerValue,
    bindInput,
    bindEl,
    cancelEditing,
    startEditing,
  } = useEditable(listName, endHeaderEditing);

  useEffect(async () => {
    if (!currentListId || !isAuthenticated) return null;
    setIsLoading(true);
    const source = CancelToken.source();
    try {
      const response = await axios.get(`/api/v1/todo-list/${currentListId}`, {
        CancelToken: source.token,
      });
      setListName(response.data.name);
      setItems(response.data.TodoListItems);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
    return () => source.cancel();
  }, [currentListId, isAuthenticated]);

  useEffect(() => {
    cancelEditing();
  }, [currentListId, cancelEditing]);

  useEffect(() => {
    if (currentListId && !isLoading && location.state?.isNew) {
      startEditing();
    }
  }, [startEditing, currentListId, location.state?.isNew, isLoading]);

  const eventDispatcher = useDispatch();
  useListener(
    Event.NEW_LIST_ITEM_ADDED,
    useCallback(
      (item) => {
        if (item.listId === currentListId)
          setItems((items) => [item].concat(items));
      },
      [currentListId, items]
    )
  );

  useListener(
    Event.NEW_LIST_ITEM_UPDATED,
    useCallback(
      (item) => {
        if (item.listId !== currentListId) return;
        setItems((items) =>
          items.map((curItem) => {
            if (curItem.id === item.id) {
              return { ...item };
            }
            return { ...curItem };
          })
        );
      },
      [currentListId, items]
    )
  );

  useListener(
    Event.LIST_ITEM_DELETED,
    useCallback(
      (id) => {
        setItems((items) => items.filter((curItem) => curItem.id !== id));
      },
      [currentListId, items]
    )
  );

  async function endHeaderEditing(newHeaderValue) {
    try {
      await axios.put(`/api/v1/todo-list/${currentListId}`, {
        name: newHeaderValue,
      });
      setListName(newHeaderValue);
      eventDispatcher(Event.LIST_UPDATED, currentListId, newHeaderValue);
    } catch (e) {
      console.log(e);
      cancelEditing();
    }
  }

  function renderItems(listId) {
    return [
      <TodoListItem
        key={`${listId}-${0}`}
        id={0}
        listId={currentListId}
        isNew={true}
        shouldFocus={!editingHeader}
      />,
    ].concat(
      items.map((item) => {
        return <TodoListItem key={`${listId}-${item.id}`} {...item} />;
      })
    );
  }

  function clearAll() {
    alertConfirm(async (onClose) => {
      if (deleteRef.current) return;
      deleteRef.current = true;
      try {
        const response = await axios.delete(
          `/api/v1/todo-list/${currentListId}/todo-list-item/all`
        );
        setItems([]);
      } catch (e) {
        console.log(e);
      } finally {
        deleteRef.current = false;
      }
      onClose();
    });
  }

  function clearCompleted() {
    alertConfirm(async (onClose) => {
      if (deleteRef.current) return;
      deleteRef.current = true;
      try {
        const response = await axios.delete(
          `/api/v1/todo-list/${currentListId}/todo-list-item/completed`
        );
        setItems((items) => items.filter((item) => !item.completed));
      } catch (error) {
        console.log(error);
      } finally {
        deleteRef.current = false;
      }
      onClose();
    });
  }

  function renderContent() {
    return currentListId ? (
      <Fragment>
        {editingHeader ? (
          <input
            ref={headerRef}
            className="pb-2 bg-transparent border-b border-solid border-gray-300 w-full text-center text-3xl text-bold mb-8 outline-none"
            {...bindInput}
          />
        ) : (
          <h2
            className="text-center text-3xl text-bold mb-4 pb-2 border-b border-transparent"
            {...bindEl}
          >
            {headerValue}
          </h2>
        )}
        {items.length > 0 ? (
          <div className="text-right mb-6">
            <button
              className={
                "bg-red-500 text-white rounded text-center px-5 py-1.5 disabled:bg-red-200 text-sm"
              }
              onClick={clearAll}
            >
              <i className="fas fa-trash mr-2"></i>Clear All
            </button>
            <button
              className={
                "bg-red-500 text-white rounded text-center px-5 py-1.5 disabled:bg-red-200 ml-2 text-sm"
              }
              onClick={clearCompleted}
            >
              <i className="fas fa-trash mr-2"></i>Clear Completed
            </button>
          </div>
        ) : null}

        {renderItems(query.listId)}
      </Fragment>
    ) : (
      <p className="text-3xl text-center p-4 text-gray-500">
        Select a list to display items!
      </p>
    );
  }

  return (
    <div className="flex flex-grow">
      <div className="flex-grow mt-10 px-44">
        {isLoading ? (
          <div className="text-center">
            {" "}
            <Loader />{" "}
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}

export default TodoContent;
