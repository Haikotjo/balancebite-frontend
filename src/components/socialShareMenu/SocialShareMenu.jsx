import { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { buildShareItems } from "../../features/meals/utils/helpers/buildShareItems.js";
import PropTypes from "prop-types";

const SocialShareMenu = ({ url = window.location.href, title = "Check dit uit!" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareItems = buildShareItems(url, title, copied);

    return (
        <motion.button
            ref={menuRef}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            className="relative flex h-full w-full items-center justify-center rounded-xl bg-black/50 transition-colors hover:bg-black/70"
        >
            <Share2 size={18} color="white" />

            {isOpen && (
                <div
                    className="absolute top-full mt-3 right-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right z-[99999]"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-2 flex flex-col gap-1">
                        {shareItems.map((item, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    if (item.isCopy) {
                                        item.action(handleCopy);
                                    } else {
                                        item.action();
                                        setIsOpen(false);
                                    }
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </motion.button>
    );
};

SocialShareMenu.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
};

export default SocialShareMenu;
