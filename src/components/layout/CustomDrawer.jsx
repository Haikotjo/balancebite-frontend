// src/components/layout/CustomDrawer.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CustomBox from './CustomBox.jsx';

/**
 * CustomDrawer — een simpel slide‑in paneel vanaf rechts
 * @param {boolean} open      – of het paneel open staat
 * @param {Function} onClose  – callback om het paneel te sluiten
 * @param {number|string} width – breedte van het paneel (bv. '300px' of 'w-[300px]')
 * @param {React.ReactNode} children – inhoud van het paneel
 */
const CustomDrawer = ({ open, onClose, width = 'w-[300px]', children }) => {
    const containerRef = useRef();

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
                'fixed top-0 right-0 h-full bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out',
                width,
                open ? 'translate-x-0' : 'translate-x-full'
            )}
            ref={containerRef}
        >
            {children}
        </CustomBox>
    );
};

CustomDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    width: PropTypes.string,
    children: PropTypes.node,
};

export default CustomDrawer;
