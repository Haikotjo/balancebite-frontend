import { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogIn, LogOut, UserPlus, ChevronDown } from "lucide-react";
import { buildNavItems } from "../../utils/navItems.js";
import clsx from "clsx";
import { AuthContext } from "../../../../context/AuthContext.jsx";
import useLogout from "../../../../hooks/useLogout.js";
import Logo from "../../../../components/logo/Logo.jsx";
import DarkModeSwitch from "../darkModeSwitch/DarkModeSwitch.jsx";
import LoginRegisterForm from "../authLoginRegisterForm/LoginRegisterForm.jsx";

const NavBar = () => {
    const { user } = useContext(AuthContext);
    const handleLogout = useLogout();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [startInRegisterMode, setStartInRegisterMode] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileCollapsed, setMobileCollapsed] = useState(new Set());
    const [desktopOpen, setDesktopOpen] = useState(false);
    const closeTimer = useRef(null);
    const desktopRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();

    // Close mobile sidebar on navigation
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    // Desktop: hover opens, mouse leave closes with delay, click outside closes immediately
    const handleMouseEnter = () => {
        clearTimeout(closeTimer.current);
        setDesktopOpen(true);
    };
    const handleMouseLeave = () => {
        closeTimer.current = setTimeout(() => setDesktopOpen(false), 350);
    };
    const handleDesktopToggle = () => setDesktopOpen((p) => !p);

    useEffect(() => {
        if (!desktopOpen) return;
        const handler = (e) => {
            if (desktopRef.current && !desktopRef.current.contains(e.target)) {
                setDesktopOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [desktopOpen]);

    const handleLoginClick = () => { setStartInRegisterMode(false); setShowLoginForm(true); };
    const handleRegisterClick = () => { setStartInRegisterMode(true); setShowLoginForm(true); };

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        if (path.includes("?")) {
            const [p, q] = path.split("?");
            return location.pathname.startsWith(p) && location.search.includes(q);
        }
        return location.pathname.startsWith(path);
    };

    const navItems = buildNavItems(user);

    // Mobile: always left-aligned
    const mobileItemCls = (path) => clsx(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-white",
        "hover:bg-white/10 transition-colors text-sm font-medium",
        isActive(path) && "bg-white/20"
    );
    const mobileAuthCls = "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-white hover:bg-white/10 transition-colors text-sm font-medium";

    // Desktop: centered when collapsed, left-aligned when expanded
    const desktopItemCls = (path) => clsx(
        "w-full flex items-center py-2.5 rounded-md text-white",
        "hover:bg-white/10 transition-colors text-sm font-medium",
        desktopOpen ? "gap-3 px-3 justify-start" : "justify-center",
        isActive(path) && "bg-white/20"
    );
    const desktopAuthCls = clsx(
        "w-full flex items-center py-2.5 rounded-md text-white hover:bg-white/10 transition-colors text-sm font-medium",
        desktopOpen ? "gap-3 px-3 justify-start" : "justify-center"
    );

    return (
        <>
            {/* ── MOBILE: floating hamburger button top-left ── */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-3 left-3 z-50 p-2 rounded-md bg-transparent border-2 border-app-bar text-app-bar md:hidden"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6" strokeWidth={2.5} />
            </button>

            {/* ── MOBILE: sidebar overlay ─────────────────────── */}

            <div
                className={clsx(
                    "fixed inset-0 z-[199] bg-black/40 backdrop-blur-sm md:hidden",
                    "transition-opacity duration-300",
                    mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={() => setMobileOpen(false)}
            />
            <div className={clsx(
                "fixed left-0 top-0 h-screen w-72 z-[200] flex flex-col bg-app-bar md:hidden",
                "transition-transform duration-300 ease-in-out",
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
                    <Logo size={28} className="text-white" to="/" />
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="p-1 text-white rounded-md hover:bg-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {navItems.map(({ label, icon: Icon, path, sub }) => (
                        <div key={label}>
                            <button
                                onClick={() => {
                                    if (sub?.length > 0) {
                                        setMobileCollapsed((prev) => {
                                            const next = new Set(prev);
                                            next.has(label) ? next.delete(label) : next.add(label);
                                            return next;
                                        });
                                    } else {
                                        navigate(path);
                                    }
                                }}
                                className={clsx(mobileItemCls(path), sub?.length > 0 && "justify-between")}
                            >
                                <span className="flex items-center gap-3">
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span className="whitespace-nowrap">{label}</span>
                                </span>
                                {sub?.length > 0 && (
                                    <ChevronDown className={clsx("w-4 h-4 transition-transform duration-200", !mobileCollapsed.has(label) && "rotate-180")} />
                                )}
                            </button>

                            {sub?.length > 0 && !mobileCollapsed.has(label) && (
                                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                                    {sub.map(({ label: subLabel, icon: SubIcon, path: subPath }) => (
                                        <button
                                            key={String(subLabel)}
                                            onClick={() => { navigate(String(subPath)); setMobileOpen(false); }}
                                            className={clsx(
                                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-white/80 text-xs font-medium",
                                                "hover:bg-white/10 hover:text-white transition-colors",
                                                isActive(String(subPath)) && "bg-white/15 text-white"
                                            )}
                                        >
                                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="whitespace-nowrap">{subLabel}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-2 border-t border-white/10 space-y-0.5">
                    {!user ? (
                        <>
                            <button onClick={() => { handleLoginClick(); setMobileOpen(false); }} className={mobileAuthCls}>
                                <LogIn className="w-5 h-5 shrink-0" /><span>Sign in</span>
                            </button>
                            <button onClick={() => { handleRegisterClick(); setMobileOpen(false); }} className={mobileAuthCls}>
                                <UserPlus className="w-5 h-5 shrink-0" /><span>Register</span>
                            </button>
                        </>
                    ) : (
                        <button onClick={() => handleLogout(() => setMobileOpen(false))} className={mobileAuthCls}>
                            <LogOut className="w-5 h-5 shrink-0" /><span>Log out</span>
                        </button>
                    )}
                    <DarkModeSwitch variant="icon" expanded={true} />
                </div>
            </div>

            {/* ── DESKTOP (md+): thin expandable sidebar ──────── */}
            <div
                ref={desktopRef}
                className={clsx(
                    "fixed left-0 top-0 h-screen z-50 bg-app-bar",
                    "hidden md:flex flex-col overflow-hidden",
                    "transition-[width] duration-300 ease-in-out",
                    desktopOpen ? "w-52" : "w-12"
                )}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Header: collapsed = logo only, expanded = logo + hamburger side by side */}
                <div className={clsx(
                    "flex items-center py-3 border-b border-white/10 shrink-0",
                    desktopOpen ? "flex-row justify-between px-3" : "flex-col gap-2 items-center"
                )}>
                    <button
                        onClick={handleDesktopToggle}
                        className="p-1 text-white rounded-md hover:bg-white/10 transition-all duration-300"
                        aria-label="Toggle menu"
                    >
                        <Logo size={desktopOpen ? 28 : 18} className="text-white" />
                    </button>
                    <button
                        onClick={handleDesktopToggle}
                        className="p-1 text-white rounded-md hover:bg-white/10"
                        aria-label="Toggle menu"
                    >
                        <Menu className={clsx("transition-all duration-300", desktopOpen ? "w-7 h-7" : "w-5 h-5")} />
                    </button>
                </div>

                {/* Navigation items */}
                <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                    {navItems.map(({ label, icon: Icon, path, sub }) => (
                        <div key={label}>
                            <button onClick={() => navigate(path)} className={desktopItemCls(path)}>
                                <Icon className="w-5 h-5 shrink-0" />
                                {desktopOpen && <span className="whitespace-nowrap">{label}</span>}
                            </button>

                            {desktopOpen && sub?.length > 0 && (
                                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-white/20 pl-2">
                                    {sub.map(({ label: subLabel, icon: SubIcon, path: subPath }) => (
                                        <button
                                            key={String(subLabel)}
                                            onClick={() => navigate(String(subPath))}
                                            className={clsx(
                                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-white/80 text-xs font-medium",
                                                "hover:bg-white/10 hover:text-white transition-colors",
                                                isActive(String(subPath)) && "bg-white/15 text-white"
                                            )}
                                        >
                                            <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                            <span className="whitespace-nowrap">{subLabel}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Footer: auth buttons + theme toggle */}
                <div className="p-2 border-t border-white/10 space-y-0.5 shrink-0">
                    {!user ? (
                        <>
                            <button onClick={handleLoginClick} className={desktopAuthCls}>
                                <LogIn className="w-5 h-5 shrink-0" />
                                {desktopOpen && <span className="whitespace-nowrap">Sign in</span>}
                            </button>
                            <button onClick={handleRegisterClick} className={desktopAuthCls}>
                                <UserPlus className="w-5 h-5 shrink-0" />
                                {desktopOpen && <span className="whitespace-nowrap">Register</span>}
                            </button>
                        </>
                    ) : (
                        <button onClick={handleLogout} className={desktopAuthCls}>
                            <LogOut className="w-5 h-5 shrink-0" />
                            {desktopOpen && <span className="whitespace-nowrap">Log out</span>}
                        </button>
                    )}
                    <DarkModeSwitch variant="icon" expanded={desktopOpen} />
                </div>
            </div>

            {showLoginForm && (
                <LoginRegisterForm
                    onClose={() => setShowLoginForm(false)}
                    onLogin={() => setShowLoginForm(false)}
                    onRegister={() => setShowLoginForm(false)}
                    startInRegisterMode={startInRegisterMode}
                />
            )}
        </>
    );
};

export default NavBar;
