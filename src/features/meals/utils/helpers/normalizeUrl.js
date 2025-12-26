const normalizeUrl = (value) => {
    const v = (value ?? "").trim();
    if (!v) return null;

    // Already has a scheme
    if (/^https?:\/\//i.test(v)) return v;

    // Allow people to type "www..." or "example.com"
    return `https://${v}`;
};

export default normalizeUrl;
