// src/components/layout/CustomDrawer.jsx
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CustomBox from './CustomBox.jsx';

/**
 * CustomDrawer – A simple slide-in panel from the right side of the viewport.
 *
 * Handles:
 * - Slide-in / slide-out animation based on the `open` state.
 * - Closing the drawer when clicking outside its container.
 * - A scrollable inner content area.
 *
 * @param {boolean} open - Controls whether the drawer is visible.
 * @param {Function} onClose - Callback invoked when the drawer should close (e.g. outside click).
 * @param {string} [width='w-[300px]'] - Tailwind width classes for the drawer container
 *                                      (e.g. 'w-[300px]', 'w-[220px] sm:w-[300px]').
 * @param {React.ReactNode} children - The content to render inside the drawer.
 * @param {string} [contentClassName] - Optional additional Tailwind classes for the inner
 *                                      scrollable content container.
 */
const CustomDrawer = ({ open, onClose, width = 'w-[300px]', children, contentClassName = "" }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const handler = e => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                onClose();
            }
        };
        if (open) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open, onClose]);

    return (
        <CustomBox
            className={clsx(
                'fixed top-0 right-0 h-full bg-lightBackground dark:bg-darkBackground z-50 transform transition-transform duration-1000 ease-in-out',
                width,
                open ? 'translate-x-0' : 'translate-x-full'
            )}
            ref={containerRef}
        >
            <CustomBox
                className={clsx(
                    "w-full h-full flex flex-col overflow-y-auto",
                    contentClassName
                )}
            >
                {children}
            </CustomBox>
        </CustomBox>
    );
};

CustomDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    width: PropTypes.string,
    children: PropTypes.node,
    contentClassName: PropTypes.string,
};

export default CustomDrawer;
