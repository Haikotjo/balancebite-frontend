import { useState } from "react";

const useExpand = (initialState = false) => {
    const [expanded, setExpanded] = useState(initialState);

    const toggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    return { expanded, toggleExpand };
};

export default useExpand;
