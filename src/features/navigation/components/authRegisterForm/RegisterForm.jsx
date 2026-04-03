import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, User, Mail, Lock, ShieldCheck, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import registerSchema from "../../../../utils/helpers/registerSchema.js";
import useRegister from "../../../../hooks/useRegister.js";
import { getMappedFoodSources } from "../../../../services/apiService.js";
import Logo from "../../../../components/logo/Logo.jsx";

const ROLES = ["USER", "ADMIN", "CHEF", "SUPERMARKET", "RESTAURANT", "DIETITIAN"];

const inputCls = "w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-surface-sunken text-content text-sm placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";
const selectCls = "w-full px-3 py-2.5 rounded-xl border border-border bg-surface-sunken text-content text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors";

const RegisterForm = ({ onClose, onSwitchToLogin, showRoles = false, isAdminContext = false }) => {
    const { handleRegistration, errorMessage, successMessage, setErrorMessage, setSuccessMessage } = useRegister();
    const [foodSourceOptions, setFoodSourceOptions] = useState([]);
    const [selectedRole, setSelectedRole] = useState("USER");
    const [selectedFoodSource, setSelectedFoodSource] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onBlur",
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            roles: ["USER"],
            foodSource: null,
        },
    });

    useEffect(() => { register("foodSource"); }, [register]);

    useEffect(() => {
        if (!showRoles) return;
        getMappedFoodSources()
            .then(setFoodSourceOptions)
            .catch((e) => console.error("Failed to fetch food sources", e));
    }, [showRoles]);

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setValue("roles", [role]);
        if (role !== "SUPERMARKET") {
            setValue("foodSource", null);
            setSelectedFoodSource("");
        }
    };

    const dismissMessage = () => {
        if (errorMessage) setErrorMessage("");
        if (successMessage) setSuccessMessage("");
    };

    return (
        <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative">
            {/* Colored header */}
            <div className="bg-gradient-to-br from-app-bar to-primary px-6 pt-8 pb-6 flex flex-col items-center gap-2">
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
                <Logo size={40} className="text-white" />
                <h2 className="text-2xl font-bold text-white tracking-tight">Create account</h2>
                <p className="text-sm text-white/70">Join BalanceBite today</p>
            </div>

            {/* Form body */}
            <form
                onSubmit={handleSubmit((data) => handleRegistration(data, onClose, isAdminContext))}
                className="px-6 py-6 flex flex-col gap-4 max-h-[60vh] overflow-y-auto"
            >
                {errorMessage && (
                    <div className="flex items-start gap-2 text-sm text-error bg-error/10 rounded-xl px-3 py-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex-1">{errorMessage}</span>
                        <button type="button" onClick={dismissMessage} className="text-xs underline shrink-0">Dismiss</button>
                    </div>
                )}

                {successMessage && (
                    <div className="flex items-start gap-2 text-sm text-success bg-success/10 rounded-xl px-3 py-2.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="flex-1">{successMessage}</span>
                        <button type="button" onClick={dismissMessage} className="text-xs underline shrink-0">Dismiss</button>
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Username</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input type="text" {...register("userName")} placeholder="johndoe" className={inputCls} />
                    </div>
                    {errors.userName && <p className="text-xs text-error">{errors.userName.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input type="email" {...register("email")} placeholder="email@example.com" className={inputCls} />
                    </div>
                    {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input type={showPassword ? "text" : "password"} {...register("password")} placeholder="••••••••" className={inputCls} />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Confirm Password</label>
                    <div className="relative">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input type={showConfirm ? "text" : "password"} {...register("confirmPassword")} placeholder="••••••••" className={inputCls} />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content transition-colors"
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                        >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-error">{errors.confirmPassword.message}</p>}
                </div>

                {showRoles && (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-content">Role</label>
                            <select value={selectedRole} onChange={(e) => handleRoleChange(e.target.value)} className={selectCls}>
                                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                            {errors.roles && <p className="text-xs text-error">{errors.roles.message}</p>}
                        </div>

                        {selectedRole === "SUPERMARKET" && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-content">Supermarket Source</label>
                                <select
                                    value={selectedFoodSource}
                                    onChange={(e) => {
                                        setSelectedFoodSource(e.target.value);
                                        setValue("foodSource", e.target.value || null, { shouldValidate: true, shouldDirty: true });
                                    }}
                                    className={selectCls}
                                >
                                    <option value="">Select a source</option>
                                    {foodSourceOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                {errors.foodSource && <p className="text-xs text-error">{errors.foodSource.message}</p>}
                            </div>
                        )}
                    </>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || (selectedRole === "SUPERMARKET" && !selectedFoodSource)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-app-bar to-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 mt-1 shadow-sm"
                >
                    {isSubmitting ? "Creating account…" : "Register"}
                </button>

                {!isAdminContext && onSwitchToLogin && (
                    <p className="text-center text-sm text-content-muted">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onSwitchToLogin}
                            className="text-primary font-semibold hover:underline transition-colors"
                        >
                            Sign in
                        </button>
                    </p>
                )}
            </form>
        </div>
    );
};

RegisterForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToLogin: PropTypes.func,
    showRoles: PropTypes.bool,
    isAdminContext: PropTypes.bool,
};

export default RegisterForm;
