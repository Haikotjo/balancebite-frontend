import { useState, useEffect } from "react";

/**
 * Custom hook to manage the state of a sidebar (open/close).
 *
 * This hook provides:
 * - A state variable `open` to track whether the sidebar is open.
 * - A function `toggleSidebar` to toggle the sidebar's visibility.
 *
 * @param {boolean} initialState - The initial state of the sidebar (true for open, false for closed).
 * @returns {Object} An object containing:
 *   - `open` {boolean} - The current state of the sidebar.
 *   - `toggleSidebar` {Function} - Function to toggle the sidebar open/closed.
 */
const useSidebarState = (initialState) => {
    const [open, setOpen] = useState(initialState);

    // If initialState changes after first render, update internal state safely
    useEffect(() => {
        setOpen(initialState);
    }, [initialState]);

    const toggleSidebar = () => {
        setOpen((prev) => !prev);
    };

    return { open, toggleSidebar };
};

export default useSidebarState;
