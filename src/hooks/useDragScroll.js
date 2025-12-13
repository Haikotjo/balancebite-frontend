// src/hooks/useDragScroll.js
import { useEffect, useRef } from "react";

export const useDragScroll = (ref) => {
    const isDown = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    useEffect(() => {
        const slider = ref.current;
        if (!slider) return;

        const handleDown = (e) => {
            e.preventDefault();
            isDown.current = true;
            slider.classList.add("cursor-grabbing");
            startX.current = e.pageX - slider.offsetLeft;
            scrollLeft.current = slider.scrollLeft;
        };

        const handleLeave = () => {
            isDown.current = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleUp = () => {
            isDown.current = false;
            slider.classList.remove("cursor-grabbing");
        };

        const handleMove = (e) => {
            if (!isDown.current) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX.current) * 2;
            slider.scrollLeft = scrollLeft.current - walk;
        };

        slider.addEventListener("mousedown", handleDown);
        slider.addEventListener("mouseleave", handleLeave);
        slider.addEventListener("mouseup", handleUp);
        slider.addEventListener("mousemove", handleMove);

        return () => {
            slider.removeEventListener("mousedown", handleDown);
            slider.removeEventListener("mouseleave", handleLeave);
            slider.removeEventListener("mouseup", handleUp);
            slider.removeEventListener("mousemove", handleMove);
        };
    }, [ref]);
};
