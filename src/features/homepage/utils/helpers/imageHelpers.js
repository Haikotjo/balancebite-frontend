// Returns first meal image or fallback
export function getMealImage(meal) {
    if (meal?.imageUrls?.length > 0) return meal.imageUrls[0];

    return "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80";
}

// Returns diet image based on index (rotating set)
export function getDietImage(index) {
    const images = [
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80",
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1400&q=80",
    ];

    return images[index % images.length];
}