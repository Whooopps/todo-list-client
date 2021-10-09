import { useCallback, useState } from "react";
import { Fragment } from "react/cjs/react.production.min";
import { Event } from "../constants/event";
import { useEditable } from "../effects/use-editable";
import { useDispatch } from "../effects/use-event";
import { alertConfirm } from "../util/confirm-alert";

function TodoListItem({ id, name, completed, isNew, shouldFocus = true }) {
  const [checked, setChecked] = useState(completed);
  const [newItemText, setNewItemText] = useState("");
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { isEditing, ref, value, bindInput, bindEl } = useEditable(
    name,
    editItem
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

  function addItem() {
    if (isAddingItem || !newItemText.trim()) return;
    setIsAddingItem(true);
    // fake api call delay
    // todo: replace with actual api call
    setTimeout(() => {
      setIsAddingItem(false);
      setNewItemText("");
      dispatcher(Event.NEW_LIST_ITEM_ADDED, {
        id,
        name: newItemText,
        completed: false,
      });
    }, 500);
  }

  function editItem(newName) {
    dispatcher(Event.NEW_LIST_ITEM_UPDATED, {
      id,
      name: newName,
      completed: checked,
    });
  }

  function toggleChecked() {
    setChecked(!checked);
    dispatcher(Event.NEW_LIST_ITEM_UPDATED, {
      id,
      name: value,
      completed: !checked,
    });
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
    alertConfirm((onClose) => {
      dispatcher(Event.LIST_ITEM_DELETED, id);
      onClose();
    });
  }
  return (
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
              className="mr-4 w-6 h-6 flex-grow-0 flex-shrink-0 self-center outline-none"
              type="checkbox"
              checked={checked}
              onChange={toggleChecked}
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
  );
}

export default TodoListItem;
