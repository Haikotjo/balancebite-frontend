import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

const SidebarShell = ({ open, onToggle, children }) => {
    const drawerRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (drawerRef.current && !drawerRef.current.contains(e.target)) {
                onToggle();
            }
        };
        if (open) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onToggle]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={clsx(
                    "fixed inset-0 z-[1400] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300",
                    open ? "opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={clsx(
                    "fixed right-0 top-0 z-[1500] h-full w-[300px] sm:w-[360px] transform transition-transform duration-300 ease-in-out",
                    open ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex h-full flex-col overflow-hidden rounded-l-2xl border-l border-border bg-surface shadow-2xl">
                    {children}
                </div>
            </div>
        </>
    );
};

SidebarShell.propTypes = {
    open: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

export default SidebarShell;
