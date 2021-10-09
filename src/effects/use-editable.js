import { useCallback, useEffect, useRef, useState } from "react";

export function useEditable(initialValue, onEdit) {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const ref = useRef();

  const startEditing = useCallback(() => {
    setIsEditing(true);
  }, [setIsEditing]);

  const cancelEditing = useCallback(() => {
    setValue(initialValue);
    setIsEditing(false);
  }, [initialValue, setValue, setIsEditing]);

  const endEditing = useCallback(() => {
    if (!isEditing) return;
    if (!value.trim()) return cancelEditing();
    setIsEditing(false);
    onEdit(value);
  }, [isEditing, value, onEdit, cancelEditing, setIsEditing]);

  function onKeyUp(e) {
    switch (e.key) {
      case "Escape":
        cancelEditing();
        break;
      case "Enter":
        endEditing();
        break;
    }
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [isEditing]);

  return {
    ref,
    value,
    isEditing,
    setValue,
    startEditing,
    cancelEditing,
    endEditing,
    bindInput: {
      onKeyUp,
      value,
      onChange: (e) => setValue(e.target.value),
      onBlur: () => endEditing(),
    },
    bindEl: {
      onClick: () => startEditing(),
    },
  };
}
