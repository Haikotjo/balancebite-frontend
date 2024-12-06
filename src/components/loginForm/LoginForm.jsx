import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, TextField, Button, Alert, Collapse } from "@mui/material";

const LoginForm = ({ onSubmit, errorMessage, onClose }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(email, password);
    };

    return (
        <Collapse in={true}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    backgroundColor: "white",
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    zIndex: 10,
                    position: "absolute",
                    right: 16,
                    top: "100%",
                }}
            >
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                <TextField
                    label="Email"
                    type="email"
                    size="small"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="small"
                >
                    Login
                </Button>
                <Button
                    variant="text"
                    size="small"
                    onClick={onClose}
                    sx={{ alignSelf: "flex-end" }}
                >
                    Close
                </Button>
            </Box>
        </Collapse>
    );
};

// Voeg PropTypes toe na de definitie van de component
LoginForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
    onClose: PropTypes.func.isRequired,
};

export default LoginForm;
