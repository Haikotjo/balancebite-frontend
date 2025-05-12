export function getReadableApiError(error, fallback = "Something went wrong.") {
    if (!error) return fallback;

    const data = error.response?.data;

    // 1. Priority: use backend-provided error message if available
    if (typeof data === "string") return data;
    if (typeof data?.message === "string") return data.message; // 👈 toegevoegd
    if (typeof data?.error === "string") return data.error;
    if (Array.isArray(data?.errors)) return data.errors.join("\n");

    // 2. Fallback: use standard messages based on HTTP status code
    const status = error.response?.status;
    if (status === 401) return "Your session has expired. Please log in again.";
    if (status === 403) return "You are not authorized to perform this action.";
    if (status === 404) return "The requested resource was not found.";
    if (status >= 500) return "Server error. Please try again later.";

    // 3. Final fallback
    return fallback;
}
