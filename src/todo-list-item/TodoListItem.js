import { useCallback, useRef, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { Event } from "../constants/event";
import { useAxios } from "../effects/use-axios";
import { useEditable } from "../effects/use-editable";
import { useDispatch } from "../effects/use-event";
import { alertConfirm } from "../util/confirm-alert";

function TodoListItem({
  id,
  name,
  completed,
  isNew,
  listId,
  shouldFocus = true,
}) {
  const axios = useAxios();
  const [checked, setChecked] = useState(completed);
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const deleteRef = useRef(false);
  const { isEditing, ref, value, bindInput, bindEl } = useEditable(
    name,
    editItem,
    !isUpdating && !deleteRef.current
  );
  const dispatcher = useDispatch();
  const newItemInputRef = useCallback(
    (input) => {
      if (input && shouldFocus) {
        input.focus();
      }
    },
    [shouldFocus]
  );

  async function addItem() {
    if (isAddingItem || !newItemText.trim()) return;
    setIsAddingItem(true);
    try {
      const response = await axios.post(
        `/api/v1/todo-list/${listId}/todo-list-item`,
        {
          name: newItemText,
          completed: false,
        }
      );

      setNewItemText("");
      dispatcher(Event.NEW_LIST_ITEM_ADDED, response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsAddingItem(false);
    }
  }

  async function updateItem(newName, newChecked) {
    setIsUpdating(true);
    try {
      const response = await axios.put(
        `/api/v1/todo-list/${listId}/todo-list-item/${id}`,
        {
          name: newName,
          completed: newChecked,
        }
      );
      dispatcher(Event.NEW_LIST_ITEM_UPDATED, response.data);
    } catch (e) {
      console.log(e);
    } finally {
      setIsUpdating(false);
    }
  }

  function editItem(newName) {
    if (newName !== name) {
      updateItem(newName, checked);
    }
  }

  function toggleChecked() {
    setChecked(!checked);
    updateItem(name, !checked);
  }
  function onKeyUp(e) {
    switch (e.key) {
      case "Enter":
        addItem();
        break;
    }
  }
  function onDeleteClicked(e) {
    e.preventDefault();
    alertConfirm(async (onClose) => {
      if (deleteRef.current) return;
      deleteRef.current = true;
      try {
        await axios.delete(`/api/v1/todo-list/${listId}/todo-list-item/${id}`);
        dispatcher(Event.LIST_ITEM_DELETED, id);
      } catch (e) {
        console.log(e);
      } finally {
        deleteRef.current = false;
      }
      onClose();
    });
  }

  return (
    <>
      <div className="bg-white rounded px-3 py-5 w-full mb-4 shadow-sm group">
        <div className="flex items-start overflow-hidden">
          {isNew ? (
            <Fragment>
              <div className="mr-4 w-6 h-6 flex-grow-0 flex-shrink-0"></div>
              <input
                ref={newItemInputRef}
                className={`w-full text-lg outline-none border-b border-solid border-gray-300 pb-1 disabled:text-gray-400 disabled:bg-transparent`}
                placeholder="New item..."
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onBlur={addItem}
                onKeyUp={onKeyUp}
                disabled={isAddingItem}
              />
            </Fragment>
          ) : (
            <Fragment>
              <input
                className="mr-4 w-6 h-6 flex-grow-0 flex-shrink-0 self-center outline-none disabled:opacity-20"
                type="checkbox"
                checked={checked}
                onChange={toggleChecked}
                disabled={isUpdating}
              />
              {isEditing ? (
                <input
                  {...bindInput}
                  ref={ref}
                  className="w-full text-lg outline-none border-b border-solid border-gray-300 pb-1 disabled:text-gray-400 disabled:bg-transparent"
                />
              ) : (
                <Fragment>
                  <p
                    className={`text-lg flex-grow ${
                      checked ? "line-through" : ""
                    }`}
                    {...bindEl}
                  >
                    {value}
                  </p>
                  <div className="flex-grow-0 flex-shrink-0 w-6 h-6 self-center transform translate-x-2x transition-all group-hover:translate-x-0">
                    <a href="#" onClick={onDeleteClicked}>
                      <i className={"fas fa-trash text-red-800"}></i>
                    </a>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </>
  );
}

export default TodoListItem;
