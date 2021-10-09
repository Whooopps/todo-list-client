import { Fragment, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Event } from "../constants/event";
import { useEditable } from "../effects/use-editable";
import { useDispatch, useListener } from "../effects/use-event";
import useQueryParams from "../effects/use-query-params";
import TodoListItem from "../todo-list-item/TodoListItem";

function TodoContent() {
  const query = useQueryParams();
  const location = useLocation();
  const [items, setItems] = useState({
    1: {
      name: "Shopping list",
      items: [
        {
          id: 1,
          name: "Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions Onions",
          completed: false,
        },
        { id: 2, name: "Gosht", completed: true },
        { id: 3, name: "Potatoes", completed: true },
        { id: 4, name: "Potatoes", completed: true },
        { id: 5, name: "Potatoes", completed: true },
        { id: 6, name: "Potatoes", completed: true },
        { id: 7, name: "Potatoes", completed: true },
        { id: 8, name: "Potatoes", completed: true },
        { id: 9, name: "Potatoes", completed: true },
        { id: 10, name: "Potatoes", completed: true },
      ],
    },
    2: {
      name: "Trip packing",
      items: [
        { id: 1, name: "Clothes", completed: false },
        { id: 2, name: "Toothbrush", completed: true },
        { id: 3, name: "Food", completed: false },
      ],
    },
    3: {
      name: "School work",
      items: [
        { id: 1, name: "Homework", completed: false },
        { id: 2, name: "Project", completed: false },
        { id: 3, name: "Journal update", completed: false },
      ],
    },
  });

  const {
    isEditing: editingHeader,
    ref: headerRef,
    value: headerValue,
    bindInput,
    bindEl,
    cancelEditing,
    startEditing,
  } = useEditable(
    items[query.listId] ? items[query.listId].name : "",
    endHeaderEditing
  );

  useEffect(() => {
    cancelEditing();
  }, [query.listId, cancelEditing]);

  useEffect(() => {
    if (location.state?.isNew) {
      startEditing();
    }
  }, [startEditing, query.listId, location.state?.isNew]);

  const eventDispatcher = useDispatch();
  useListener(
    Event.NEW_LIST_ITEM_ADDED,
    useCallback(
      (item) => {
        if (items[query.listId]) {
          setItems({
            ...items,
            [query.listId]: {
              ...items[query.listId],
              items: [item].concat(items[query.listId].items),
            },
          });
        }
      },
      [query.listId, items]
    )
  );

  useListener(
    Event.NEW_LIST_ITEM_UPDATED,
    useCallback(
      (item) => {
        if (items[query.listId]) {
          setItems({
            ...items,
            [query.listId]: {
              ...items[query.listId],
              items: items[query.listId].items.map((curItem) => {
                if (curItem.id == item.id) {
                  return { ...item };
                }
                return { ...curItem };
              }),
            },
          });
        }
      },
      [query.listId, items]
    )
  );

  useListener(
    Event.LIST_ITEM_DELETED,
    useCallback(
      (id) => {
        if (items[query.listId]) {
          setItems({
            ...items,
            [query.listId]: {
              ...items[query.listId],
              items: items[query.listId].items.filter((item) => item.id != id),
            },
          });
        }
      },
      [query.listId, items]
    )
  );

  useListener(
    Event.LIST_DELETED,
    useCallback(
      (listId) => {
        const newItems = { ...items };
        delete newItems[listId];
        setItems(newItems);
      },
      [items]
    )
  );

  useListener(
    Event.LIST_CREATED,
    useCallback(
      (list) => {
        // todo: remove once api call is ready
        list.id = parseInt(Object.keys(items).pop(), 10) + 1;
        setItems({
          ...items,
          [list.id]: {
            name: list.name,
            items: [],
          },
        });
      },
      [items]
    )
  );

  function endHeaderEditing(newHeaderValue) {
    if (items[query.listId]) {
      setItems({
        ...items,
        [query.listId]: {
          ...items[query.listId],
          name: newHeaderValue,
        },
      });
      eventDispatcher(Event.LIST_UPDATED, query.listId, newHeaderValue);
      // todo: make server request
    }
  }

  function renderItems(listId) {
    let newExpectedId =
      items[listId].items.reduce((mx, item) => Math.max(mx, item.id), 0) + 1;
    return [
      <TodoListItem
        key={`${listId}-${0}`}
        id={newExpectedId}
        isNew={true}
        shouldFocus={!editingHeader}
      />,
    ].concat(
      items[listId].items.map((item) => {
        return <TodoListItem key={`${listId}-${item.id}`} {...item} />;
      })
    );
  }

  function clearAll() {
    setItems({
      ...items,
      [query.listId]: {
        ...items[query.listId],
        items: [],
      },
    });
  }

  return (
    <div className="flex flex-grow">
      <div className="flex-grow mt-10 px-44">
        {query.listId && items[query.listId] ? (
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
            {items[query.listId].items.length > 0 ? (
              <div className="text-right mb-6">
                <button
                  className={
                    "bg-red-500 text-white rounded text-center px-5 py-1.5 disabled:bg-red-200"
                  }
                  onClick={clearAll}
                >
                  <i className="fas fa-trash mr-2"></i>Clear All
                </button>
              </div>
            ) : null}

            {renderItems(query.listId)}
          </Fragment>
        ) : (
          <p className="text-3xl text-center p-4 text-gray-500">
            Select a list to display items!
          </p>
        )}
      </div>
    </div>
  );
}

export default TodoContent;
