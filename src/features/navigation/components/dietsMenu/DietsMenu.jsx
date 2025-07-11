import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import {ChevronDown, Apple, Pencil, UserCheck, BookOpen, UserPen, ChevronUp} from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";
import {UserDietsContext} from "../../../../context/UserDietContext.jsx";

/**
 * DietsMenu component renders a dropdown for navigating diet-related pages.
 */
const DietsMenu = () => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { setActiveOption } = useContext(UserDietsContext);


    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 3000);
    };

    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                trigger={
                    <CustomBox
                        onClick={() => setOpen(!open)}
                        className="w-full flex justify-between items-center cursor-pointer text-white"
                    >
                        <CustomTypography className="text-xs sm:text-sm text-white mr-2 md:inline">
                            Diets
                        </CustomTypography>
                        <Apple fill="white" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        {/* Chevron indicator */}
                        {open ? (
                            <>
                                <ChevronDown className="text-white w-5 h-5 mr-2 md:hidden" />
                                <ChevronUp className="text-white w-5 h-5 mr-2 hidden lg:block" />
                            </>
                        ) : (
                            <>
                                <ChevronUp className="text-white w-5 h-5 mr-2 md:hidden" />
                                <ChevronDown className="text-white w-5 h-5 mr-2 hidden lg:block" />
                            </>
                        )}
                    </CustomBox>
                }
                items={[
                    {
                        label: "Explore Diets",
                        icon: BookOpen,
                        onClick: () => {
                            setActiveOption("All Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "My Diets",
                        icon: UserCheck,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("My Diets");
                            setActiveOption("My Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "Created Diets",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Created Diets");
                            setActiveOption("Created Diets");
                            setOpen(false);
                            navigate("/diets");
                        },
                    },
                    {
                        label: "Create Diet",
                        icon: Pencil,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Create Diet");
                            setOpen(false);
                            navigate("/create-diet");
                        },
                    },
                ]}

            />

            <ErrorDialog
                open={!!authMsg}
                onClose={() => setAuthMsg(null)}
                message={authMsg || ""}
                actionLabel="Login or Register"
                onAction={() => {
                    setAuthMsg(null);
                    navigate("/login");
                }}
            />
        </>
    );
};

export default DietsMenu;
