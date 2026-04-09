import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a sentinel element.
 * Calls onLoadMore when the sentinel becomes visible and more pages are available.
 * A pendingRef prevents multiple rapid fires during the debounce window in the context.
 */
export default function useInfiniteScroll({ loading, page, totalPages, onLoadMore }) {
    const sentinelRef = useRef(null);
    const pendingRef = useRef(false);

    // Reset pending flag only when loading actually completes
    useEffect(() => {
        if (!loading) pendingRef.current = false;
    }, [loading]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && !pendingRef.current && page < totalPages) {
                    pendingRef.current = true;
                    onLoadMore();
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [loading, page, totalPages, onLoadMore]);

    return sentinelRef;
}
