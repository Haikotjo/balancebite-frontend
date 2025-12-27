// Image utilities used by MealImageUploader (pure functions only).

export const MAX_SLOTS = 5;

export const createEmptySlots = (maxSlots, withId = false) => {
    const base = { file: null, previewUrl: null };
    const slot = withId ? { ...base, id: null } : base;
    return Array.from({ length: maxSlots }, () => ({ ...slot }));
};

export const dataUrlToFile = async (dataUrl, filename = "captured-image.jpg") => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
};

export const urlToFile = async (url, filename = "url-image.jpg") => {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`Failed to fetch image (${res.status})`);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
};

export const extractFilesFromSlots = (slots) =>
    slots.map((s) => s.file).filter(Boolean);

