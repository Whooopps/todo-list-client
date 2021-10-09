import { useEffect, useRef, useState } from "react";

export function useEditable(initialValue, onEdit) {
    const [value, setValue] = useState(initialValue);
    const [isEditing, setIsEditing] = useState(false);
    const ref = useRef();

    function startEditing() {
        setIsEditing(true);
    }
    
    function cancelEditing() {
        setValue(initialValue);
        setIsEditing(false);
    }
    
    function endEditing() {
        if (!isEditing) return;
        if (!value.trim()) return cancelEditing();
        setIsEditing(false);
        onEdit(value);
    }

    function onKeyUp(e) {
        switch(e.key) {
            case 'Escape':
                cancelEditing();
                break;
            case 'Enter':
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
        }
    }
}