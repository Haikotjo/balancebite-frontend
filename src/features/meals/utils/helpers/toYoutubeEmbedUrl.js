// src/features/meals/utils/helpers/toYoutubeEmbedUrl.js
export const toYoutubeEmbedUrl = (url, { autoplay = false, mute = false, jsapi = false } = {}) => {
    if (!url) return null;

    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, "");

        let id = null;

        if (host === "youtu.be") {
            id = u.pathname.replace("/", "").trim();
        } else if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
            if (u.pathname.startsWith("/embed/")) {
                id = u.pathname.split("/embed/")[1]?.split("/")[0];
            } else if (u.pathname.startsWith("/shorts/")) {
                id = u.pathname.split("/shorts/")[1]?.split("/")[0];
            } else {
                id = u.searchParams.get("v");
            }
        }

        if (!id) return null;

        const params = new URLSearchParams({
            rel: "0",
            modestbranding: "1",
            playsinline: "1",
            autoplay: autoplay ? "1" : "0",
            mute: (autoplay || mute) ? "1" : "0",
        });

        if (jsapi) {
            params.set("enablejsapi", "1");
            // Helps YouTube allow JS API calls/events in many setups
            params.set("origin", window.location.origin);
        }

        return `https://www.youtube.com/embed/${id}?${params.toString()}`;
    } catch {
        return null;
    }
};
