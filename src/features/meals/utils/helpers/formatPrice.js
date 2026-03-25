// Formats number to EUR currency
export function formatPrice(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
        return "Price unknown";
    }

    return new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(Number(value));
}