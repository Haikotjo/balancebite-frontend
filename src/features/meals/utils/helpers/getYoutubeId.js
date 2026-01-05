// src/features/meals/utils/helpers/getYoutubeId.js
export const getYoutubeId = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");

        if (host === "youtu.be") return u.pathname.replace("/", "").trim() || null;

        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            if (u.pathname.startsWith("/embed/")) return u.pathname.split("/embed/")[1]?.split("/")[0] || null;
            if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/shorts/")[1]?.split("/")[0] || null;
            return u.searchParams.get("v");
        }

        return null;
    } catch {
        return null;
    }
};
