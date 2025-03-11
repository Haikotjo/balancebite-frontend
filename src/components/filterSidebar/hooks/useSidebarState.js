import { useState } from "react";

const useSidebarState = (initialState) => {
    const [open, setOpen] = useState(initialState);

    const toggleSidebar = () => {
        setOpen(!open);
    };

    return { open, toggleSidebar };
};

export default useSidebarState;
