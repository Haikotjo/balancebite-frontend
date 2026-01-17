import { useState, useRef, useEffect } from "react";
import { Share2 } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";
import CustomIconButton from "../layout/CustomIconButton.jsx";
import {buildShareItems} from "../../features/meals/utils/helpers/buildShareItems.js";
import PropTypes from "prop-types";

const SocialShareMenu = ({ url = window.location.href, title = "Check dit uit!" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copied] = useState(false);
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

    const shareItems = buildShareItems(url, title, copied);

    return (
        <CustomBox ref={menuRef} className="relative inline-block z-[9999]">
            <CustomIconButton
                onClick={() => setIsOpen(!isOpen)}
                icon={<Share2 size={20} color="white" />}
                className="hover:scale-110 transition-transform"
            />

            {isOpen && (
                <CustomBox
                    className="absolute top-full mt-3 right-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right z-[99999]"
                >
                    <CustomBox className="p-2 flex flex-col gap-1">
                        {shareItems.map((item, index) => (
                            <CustomButton
                                key={index}
                                onClick={() => {
                                    item.action();

                                    if (item.id !== "copy") {
                                        setIsOpen(false);
                                    }
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <CustomTypography className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {item.label}
                                </CustomTypography>
                            </CustomButton>
                        ))}
                    </CustomBox>
                </CustomBox>
            )}
        </CustomBox>
    );
};

SocialShareMenu.propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
};

export default SocialShareMenu;