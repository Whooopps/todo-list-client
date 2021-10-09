import { useCallback, useEffect } from "react";

const listeners = {};

export function useListener(event, cb) {
    useEffect(() => {
        if (!listeners[event]) {
            listeners[event] = new Set();
        }
        listeners[event].add(cb);
        return () => listeners[event].delete(cb);
    }, [event, cb]);
}

export function useDispatch() {
    return useCallback((event, ...args) => {
        if (listeners[event]) {
            Array.from(listeners[event]).forEach((cb) => {
                cb(...args)
            });
        }
    }, []);
}
