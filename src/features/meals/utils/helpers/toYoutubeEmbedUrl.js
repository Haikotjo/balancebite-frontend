// src/features/meals/utils/helpers/toYoutubeEmbedUrl.js
export const toYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");

        // youtu.be/<id>
        if (host === "youtu.be") {
            const id = u.pathname.replace("/", "").trim();
            if (!id) return null;
            return `https://www.youtube.com/embed/${id}?mute=1&rel=0&modestbranding=1`;
        }

        // youtube.com/watch?v=<id>
        if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            const v = u.searchParams.get("v");
            if (!v) return null;
            return `https://www.youtube.com/embed/${v}?mute=1&rel=0&modestbranding=1`;
        }

        // youtube.com/embed/<id>
        if (host === "youtube.com" && u.pathname.startsWith("/embed/")) {
            const id = u.pathname.split("/embed/")[1]?.split("/")[0];
            if (!id) return null;
            return `https://www.youtube.com/embed/${id}?mute=1&rel=0&modestbranding=1`;
        }

        return null;
    } catch {
        return null;
    }
};
