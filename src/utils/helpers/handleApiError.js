export const handleApiError = (error) => {
    if (error.response) {
        console.error("API Error:", error.response.data);
        alert(`Error: ${error.response.data.error || "Something went wrong"}`);
    } else if (error.request) {
        console.error("Network Error:", error.request);
        alert("Network error. Please try again later.");
    } else {
        console.error("Error:", error.message);
        alert("An unexpected error occurred.");
    }
};
