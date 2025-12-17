// Builds sidebar/dropdown items in a reusable way
export function buildSidebarItems({ items, user, close }) {
    return items.map(item => ({
        label: item.label,
        icon: item.icon,
        disabled: item.requiresAuth && !user,
        onClick: () => {
            close();
            item.onClick();
        }
    }));
}
