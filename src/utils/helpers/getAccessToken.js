export const getAccessToken = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        throw new Error("No access token available.");
    }
    return token;
};
