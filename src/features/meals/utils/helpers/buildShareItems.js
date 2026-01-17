import { Facebook, Linkedin, Link as LinkIcon, MessageCircle, Twitter } from "lucide-react";

export const buildShareItems = (url, title, copied) => [
    {
        label: "WhatsApp",
        icon: MessageCircle,
        color: "text-green-500",
        action: () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ": " + url)}`, '_blank')
    },
    {
        label: "Facebook",
        icon: Facebook,
        color: "text-blue-600",
        action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    },
    {
        label: "X",
        icon: Twitter,
        color: "text-black dark:text-white",
        action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
    },
    {
        label: "LinkedIn",
        icon: Linkedin,
        color: "text-blue-700",
        action: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
    },
    {
        id: "copy",
        label: copied ? "Link Copied!" : "Copy link",
        icon: LinkIcon,
        color: copied ? "text-green-600" : "text-gray-500",
        isCopy: true,
        action: (onCopy) => {
            navigator.clipboard.writeText(url);
            onCopy();
        }
    },
];