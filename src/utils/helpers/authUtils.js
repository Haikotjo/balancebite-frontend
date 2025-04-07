export const userHasRole = (role) => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.roles?.includes(role);
};
