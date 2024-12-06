import { Component } from "react";
import PropTypes from "prop-types";
import { Alert, AlertTitle } from "@mui/material";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Alert severity="error" sx={{ margin: 2 }}>
                    <AlertTitle>Error</AlertTitle>
                    <p>Something went wrong:</p>
                    <strong>{this.state.error?.message || "Unknown error"}</strong>
                </Alert>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
