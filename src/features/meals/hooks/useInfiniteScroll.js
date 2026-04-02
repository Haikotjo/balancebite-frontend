import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to a sentinel element.
 * Calls onLoadMore when the sentinel becomes visible and more pages are available.
 */
export default function useInfiniteScroll({ loading, page, totalPages, onLoadMore }) {
    const sentinelRef = useRef(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !loading && page < totalPages) {
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
