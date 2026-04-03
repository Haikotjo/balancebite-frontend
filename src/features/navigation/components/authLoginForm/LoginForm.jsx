import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import useLogin from "../../../../hooks/useLogin.js";
import { UserMealsContext } from "../../../../context/UserMealsContext.jsx";
import loginSchema from "./LoginForm.js";
import Logo from "../../../../components/logo/Logo.jsx";

const LoginForm = ({ onClose, onSwitchToRegister }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { handleLogin } = useLogin();
    const { fetchUserMealsData } = useContext(UserMealsContext);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(loginSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
    });

    const onSubmit = async (data) => {
        setErrorMessage("");
        try {
            localStorage.clear();
            sessionStorage.clear();
            await handleLogin(data.email.toLowerCase(), data.password, async () => {
                await fetchUserMealsData();
                if (onClose) onClose();
            });
        } catch (err) {
            setErrorMessage(err.message);
        }
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
                <h2 className="text-2xl font-bold text-white tracking-tight">Welcome back</h2>
                <p className="text-sm text-white/70">Sign in to your BalanceBite account</p>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 flex flex-col gap-4">
                {errorMessage && (
                    <div className="flex items-start gap-2 text-sm text-error bg-error/10 rounded-xl px-3 py-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input
                            type="email"
                            {...register("email")}
                            placeholder="email@example.com"
                            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-border bg-surface-sunken text-content text-sm placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
                    </div>
                    {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-content">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted pointer-events-none" />
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-border bg-surface-sunken text-content text-sm placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                        />
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

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-app-bar to-primary text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 mt-1 shadow-sm"
                >
                    {isSubmitting ? "Signing in…" : "Sign in"}
                </button>

                <p className="text-center text-sm text-content-muted">
                    No account yet?{" "}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary font-semibold hover:underline transition-colors"
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    );
};

LoginForm.propTypes = {
    onClose: PropTypes.func,
    onSwitchToRegister: PropTypes.func.isRequired,
};

export default LoginForm;
