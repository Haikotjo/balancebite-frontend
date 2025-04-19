import { useState, useRef, useEffect } from "react";

export function useDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const toggle = () => setOpen((prev) => !prev);
    const close = () => setOpen(false);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                close();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return { open, toggle, close, ref };
}
