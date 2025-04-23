import PropTypes from "prop-types";
import { Link as RouterLink } from 'react-router-dom';
import CustomCard from "../../layout/CustomCard.jsx";
import CustomBox from "../../layout/CustomBox.jsx";
import CustomTypography from "../../layout/CustomTypography.jsx";

/**
 * FeatureCard Component
 * Displays a card with a title, description, and hover effects.
 * The entire card is wrapped in a `RouterLink` to enable navigation.
 *
 * Props:
 * - `title`: The title displayed on the card.
 * - `description`: A brief description displayed below the title.
 * - `colorClass`: Tailwind class for color (e.g., 'border-primary', 'text-primary').
 * - `to`: Navigation path for the card.
 */
function FeatureCard({ title, description, colorClass = "", to }) {
    return (
        <RouterLink to={to} style={{ textDecoration: 'none', display: 'block' }}>
            <CustomCard
                className={`
                    max-w-[300px] border-2 
                    ${colorClass}
                    hover:scale-105 transition-transform duration-300 ease-in-out
                    hover:shadow-xl
                `}
            >
                <CustomBox className="p-4">
                    <CustomTypography
                        as="h3"
                        variant="h3"
                        font="display"
                        className={`mb-2 ${colorClass}`}
                        style={{ fontFamily: "'Pacifico', cursive" }}
                    >
                        {title}
                    </CustomTypography>

                    <CustomTypography
                        as="p"
                        variant="paragraph"
                        italic
                    >
                        {description}
                    </CustomTypography>
                </CustomBox>
            </CustomCard>
        </RouterLink>
    );
}

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    colorClass: PropTypes.string, // Tailwind color class (e.g. "text-primary")
    to: PropTypes.string.isRequired,
};

export default FeatureCard;
