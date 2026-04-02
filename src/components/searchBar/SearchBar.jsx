import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { CookingPot, Soup, User, Search, X } from "lucide-react";
import useDebouncedSearch from "../../hooks/useDebouncedSearch.js";

const TYPE_META = {
    meal: { Icon: Soup,      label: "Meals" },
    diet: { Icon: CookingPot, label: "Diets" },
    user: { Icon: User,      label: "Users" },
};
const TYPE_ORDER = { meal: 0, diet: 1, user: 2 };

const SearchBar = ({ onSearch, onQuerySubmit, placeholder = "Search...", placeholderCompact = "Search..." }) => {
    const [options, loading, inputValue, setInputValue] = useDebouncedSearch(onSearch, 400);
    const [isOpen, setIsOpen]               = useState(false);
    const [highlightedIndex, setHighlighted] = useState(-1);
    const [isFocused, setIsFocused]         = useState(false);
    const containerRef = useRef(null);
    const inputRef     = useRef(null);

    const sorted = [...options].sort((a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]);
    const showDropdown = isOpen && (sorted.length > 0 || loading);

    useEffect(() => {
        const onOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setHighlighted(-1);
            }
        };
        document.addEventListener("mousedown", onOutside);
        return () => document.removeEventListener("mousedown", onOutside);
    }, []);

    const submit = (opt) => {
        if (!opt) return;
        if (typeof opt === "string") {
            if (!opt.trim()) return;
            onQuerySubmit(opt.trim());
        } else if (opt.type === "user") {
            onQuerySubmit({ creatorId: opt.id, creatorUserName: opt.name });
        } else {
            onQuerySubmit(opt.name);
        }
        setInputValue("");
        setIsOpen(false);
        setHighlighted(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
            setHighlighted((i) => Math.min(i + 1, sorted.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlighted((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < sorted.length) {
                submit(sorted[highlightedIndex]);
            } else {
                submit(inputValue);
            }
        } else if (e.key === "Escape") {
            setIsOpen(false);
            setHighlighted(-1);
            inputRef.current?.blur();
        }
    };

    // Build unique group order
    const groups = [...new Set(sorted.map((o) => o.type))];

    return (
        <div
            ref={containerRef}
            className={`
                relative mx-auto my-4
                transition-all duration-300 ease-in-out
                ${isFocused ? "w-full max-w-sm" : "w-40 sm:w-52"}
            `}
        >

            {/* ── Search pill ── */}
            <div
                className={`
                    flex items-center gap-2 rounded-full bg-surface-sunken
                    border border-border
                    transition-all duration-300 ease-in-out
                    ${isFocused
                        ? "px-4 py-2.5 ring-2 ring-primary/40 border-primary shadow-sm"
                        : "px-3 py-1.5 hover:border-border-strong cursor-pointer"}
                `}
                onClick={() => !isFocused && inputRef.current?.focus()}
            >
                {/* Left icon */}
                <Search
                    size={isFocused ? 16 : 14}
                    className={`shrink-0 transition-colors duration-200 ${isFocused ? "text-primary" : "text-content-muted"}`}
                />

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsOpen(true);
                        setHighlighted(-1);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        if (sorted.length > 0) setIsOpen(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder={isFocused ? placeholder : placeholderCompact}
                    className={`
                        flex-1 min-w-0 bg-transparent border-none
                        outline-none focus:outline-none ring-0 focus:ring-0
                        text-content placeholder:text-content-muted
                        transition-all duration-300
                        ${isFocused ? "text-sm" : "text-xs w-full"}
                    `}
                />

                {/* Clear button — only when there's text */}
                {inputValue && (
                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault(); // keep focus on input
                            setInputValue("");
                            setIsOpen(false);
                            setHighlighted(-1);
                        }}
                        aria-label="clear"
                        className="shrink-0 text-content-muted hover:text-content transition-colors"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* ── Dropdown ── */}
            {showDropdown && (
                <div
                    className="
                        absolute left-0 right-0 mt-2 z-50
                        bg-surface rounded-2xl
                        shadow-xl ring-1 ring-border
                        overflow-hidden
                        animate-in fade-in slide-in-from-top-1 duration-150
                    "
                >
                    {loading && sorted.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-content-muted text-center">
                            Searching…
                        </div>
                    ) : (
                        groups.map((group) => {
                            const { Icon, label } = TYPE_META[group] ?? { Icon: Search, label: group };
                            const groupOpts = sorted.filter((o) => o.type === group);
                            return (
                                <div key={group}>
                                    {/* Group header */}
                                    <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                                        <Icon size={12} className="text-primary shrink-0" />
                                        <span className="text-[11px] font-semibold uppercase tracking-widest text-content-muted">
                                            {label}
                                        </span>
                                        <div className="flex-1 h-px bg-border" />
                                    </div>

                                    {/* Options */}
                                    <ul className="list-none m-0 p-0 pb-1">
                                        {groupOpts.map((opt) => {
                                            const idx = sorted.indexOf(opt);
                                            const isActive = idx === highlightedIndex;
                                            return (
                                                <li
                                                    key={`${opt.type}-${opt.id ?? opt.name}`}
                                                    onMouseDown={() => submit(opt)}
                                                    onMouseEnter={() => setHighlighted(idx)}
                                                    className={`
                                                        flex items-center gap-3 px-4 py-2
                                                        cursor-pointer text-sm select-none
                                                        transition-colors duration-75
                                                        ${isActive
                                                            ? "bg-primary text-content-inverted"
                                                            : "text-content hover:bg-primary-subtle/40"}
                                                    `}
                                                >
                                                    <Icon
                                                        size={14}
                                                        className={`shrink-0 ${isActive ? "opacity-90" : "text-primary"}`}
                                                    />
                                                    <span className="truncate">{opt.name}</span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

SearchBar.propTypes = {
    onSearch:      PropTypes.func.isRequired,
    onQuerySubmit: PropTypes.func.isRequired,
    placeholder:        PropTypes.string,
    placeholderCompact: PropTypes.string,
};

export default SearchBar;
