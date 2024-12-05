import React, { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null); // For error messages
    const [success, setSuccess] = useState(null); // For success messages
    const navigate = useNavigate()

    const handleLogin = async (event) => {
        event.preventDefault();

        console.log("Login attempt with email:", email); // Log email

        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            console.log("Login response status:", response.status); // Log response status

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Login error:", errorData.error || "Unknown error"); // Log error
                throw new Error(errorData.error || "Login failed");
            }

            const data = await response.json();
            console.log("Login successful, received data:", data); // Log received data

            setSuccess(data.message || "Login successful");
            setError(null);

            // Store JWT tokens in localStorage or cookies
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            console.log("Tokens stored:", data);
        } catch (err) {
            console.error("Login failed:", err.message); // Log error message
            setError(err.message);
            setSuccess(null);
        }
        navigate("/meals");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: 2,
            }}
        >
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                }}
            >
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </Box>
        </Box>
    );
}

export default LoginPage;
