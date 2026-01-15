import { useState, useRef, useEffect } from "react";
import { Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react";
import CustomBox from "../layout/CustomBox.jsx";
import CustomButton from "../layout/CustomButton.jsx";
import CustomTypography from "../layout/CustomTypography.jsx";


const SocialShareMenu = ({ url = window.location.href, title = "Check dit uit!" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    // Sluit menu als je ernaast klikt
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const shareItems = [
        { label: "Facebook", icon: Facebook, color: "text-blue-600", action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`) },
        { label: "Twitter", icon: Twitter, color: "text-sky-400", action: () => window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`) },
        { label: "LinkedIn", icon: Linkedin, color: "text-blue-700", action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`) },
        { label: "Copy Link", icon: LinkIcon, color: "text-gray-500", action: () => navigator.clipboard.writeText(url) },
    ];

    return (
        <CustomBox ref={menuRef} className="relative inline-block">
            {/* De Share Knop zelf */}
            <CustomButton
                onClick={() => setIsOpen(!isOpen)}
                className={`p-3 rounded-full bg-primary text-white shadow-lg transition-transform active:scale-90 ${isOpen ? "rotate-12" : ""}`}
            >
                <Share2 size={20} />
            </CustomButton>

            {/* Het Menu (Zwevend) */}
            {isOpen && (
                <CustomBox
                    className="absolute bottom-full mb-3 right-0 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in duration-200 origin-bottom-right"
                >
                    <div className="p-2 flex flex-col gap-1">
                        {shareItems.map((item, index) => (
                            <CustomButton
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-colors"
                            >
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <CustomTypography className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {item.label}
                                </CustomTypography>
                            </CustomButton>
                        ))}
                    </div>
                </CustomBox>
            )}
        </CustomBox>
    );
};

export default SocialShareMenu;