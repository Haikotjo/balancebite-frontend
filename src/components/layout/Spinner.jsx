import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Loader2 } from "lucide-react";

const Spinner = ({ className = "" }) => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center gap-4 mt-10 ${className}`}>
            <Loader2 className="animate-spin text-primary" size={64} />
            <span className="text-muted-foreground font-bold text-xl">
                Loading{dots}
            </span>
        </div>
    );
};

Spinner.propTypes = {
    className: PropTypes.string,
};

export default Spinner;
