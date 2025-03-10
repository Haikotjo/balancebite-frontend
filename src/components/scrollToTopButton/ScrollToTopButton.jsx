import { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useTheme } from "@mui/material/styles";

const ScrollToTopButton = () => {
    const theme = useTheme();
    const [showScrollButton, setShowScrollButton] = useState(false);

    // 🔥 Check scroll positie
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // 🔥 Scroll naar boven functie
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        showScrollButton && (
            <IconButton
                onClick={scrollToTop}
                sx={{
                    position: "fixed",
                    bottom: "20px",
                    right: "20px",
                    backgroundColor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                    },
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
                }}
            >
                <ArrowDropUpIcon sx={{ fontSize: 45 }} />
            </IconButton>
        )
    );
};

export default ScrollToTopButton;
