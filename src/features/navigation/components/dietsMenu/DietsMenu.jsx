import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import {ChevronDown, Apple, Pencil, UserCheck, BookOpen, UserPen, ChevronUp} from "lucide-react";
import CustomTypography from "../../../../components/layout/CustomTypography.jsx";

/**
 * DietsMenu component renders a dropdown for navigating diet-related pages.
 */
const DietsMenu = () => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const showAuth = (label) => {
        setAuthMsg(`Please log in to access ${label.toLowerCase()}.`);
        setTimeout(() => setAuthMsg(null), 3000);
    };

    return (
        <>
            <CustomDropdownWeb
                open={open}
                onOpenChange={setOpen}
                className="mt-2 left-0 sm:left-auto sm:right-0 min-w-[10rem] max-w-[90vw]"
                trigger={
                    <CustomBox
                        onClick={() => setOpen(!open)}
                        className="flex items-center cursor-pointer text-white"
                    >
                        <CustomTypography className="hidden text-sm text-white sm:inline mr-2">
                            Diets
                        </CustomTypography>
                        <Apple fill="white" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        {/* Chevron indicator */}
                        {open ? (
                            <>
                                <ChevronDown className="text-white w-5 h-5 mr-2 sm:hidden" />
                                <ChevronUp className="text-white w-5 h-5 mr-2 hidden sm:block" />
                            </>
                        ) : (
                            <>
                                <ChevronUp className="text-white w-5 h-5 mr-2 sm:hidden" />
                                <ChevronDown className="text-white w-5 h-5 mr-2 hidden sm:block" />
                            </>
                        )}
                    </CustomBox>
                }
                items={[
                    {
                        label: "Explore Diets",
                        icon: BookOpen,
                        onClick: () => {
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
                            setOpen(false);
                            navigate("/diets?tab=my-diets");
                        },
                    },
                    {
                        label: "Created Diets",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Created Diets");
                            setOpen(false);
                            navigate("/meals");
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
