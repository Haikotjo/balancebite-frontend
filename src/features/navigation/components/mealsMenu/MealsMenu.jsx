import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import CustomBox from "../../../../components/layout/CustomBox.jsx";
import CustomDropdownWeb from "../../../../components/layout/CustomDropdownWeb.jsx";
import ErrorDialog from "../../../../components/layout/ErrorDialog.jsx";
import { ChevronDown, Soup, ChevronUp, Pencil, UserPen, BookOpen } from "lucide-react";

const MealsMenu = () => {
    const [open, setOpen] = useState(false);
    const [authMsg, setAuthMsg] = useState(null);
    const { user } = useContext(AuthContext);
    const { setActiveOption } = useContext(UserMealsContext);
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
                className="absolute bottom-full left-0 min-w-[10rem] max-w-[90vw] md:left-full md:top-0 md:bottom-auto"
                trigger={
                    <CustomBox
                        onClick={() => setOpen(!open)}
                        onMouseEnter={() => window.innerWidth >= 768 && setOpen(true)}
                        onMouseLeave={() => window.innerWidth >= 768 && setOpen(false)}
                        className="p-2 rounded-md transition-all hover:bg-white/10 cursor-pointer flex items-center justify-center w-full md:w-auto"
                    >
                        <Soup fill="white" className="w-6 h-6 text-white" />
                        {open ? (
                            <ChevronUp className="text-white w-5 h-5 ml-1" />
                        ) : (
                            <ChevronDown className="text-white w-5 h-5 ml-1" />
                        )}
                    </CustomBox>
                }
                items={[
                    {
                        label: "Explore Meals",
                        icon: BookOpen,
                        onClick: () => {
                            setOpen(false);
                            setActiveOption("All Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "My Meals",
                        icon: Soup,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("My Meals");
                            setOpen(false);
                            setActiveOption("My Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Created Meals",
                        icon: UserPen,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Created Meals");
                            setOpen(false);
                            setActiveOption("Created Meals");
                            navigate("/meals");
                        },
                    },
                    {
                        label: "Create Meal",
                        icon: Pencil,
                        disabled: !user,
                        onClick: () => {
                            if (!user) return showAuth("Create Meal");
                            setOpen(false);
                            navigate("/create-meal");
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

export default MealsMenu;
