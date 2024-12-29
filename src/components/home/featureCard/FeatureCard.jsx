import { alpha, Card, CardContent, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from "prop-types";

/**
 * FeatureCard Component
 * Displays a card with a title, description, and hover effects.
 * The entire card is wrapped in a `RouterLink` to enable navigation.
 *
 * Props:
 * - `title`: The title displayed on the card.
 * - `description`: A brief description displayed below the title.
 * - `colorKey`: Key for theming the card's color (e.g., 'primary', 'secondary').
 * - `to`: Navigation path for the card.
 */
function FeatureCard({ title, description, colorKey, to }) {
    const theme = useTheme();

    // Determine the color based on the theme palette and the provided colorKey.
    const color = theme.palette[colorKey]?.main || theme.palette.text.primary;

    return (
        <RouterLink to={to} style={{ textDecoration: 'none', display: 'block' }}>
            <Card
                sx={{
                    maxWidth: 300, // Maximum width of the card
                    borderRadius: 8, // Rounded corners
                    boxShadow: 3, // Initial shadow effect
                    border: `3px solid ${theme.palette[colorKey]?.main || theme.palette.grey[200]}`, // Themed border color
                    backgroundColor: 'white', // Background color
                    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease', // Smooth hover transition
                    '&:hover': {
                        transform: 'scale(1.1)', // Slight enlargement on hover
                        boxShadow: 6, // Enhanced shadow on hover
                    },
                }}
            >
                <CardContent>
                    {/* Display the card title */}
                    <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{
                            fontFamily: "'Pacifico', cursive", // Custom font styling
                            color: color, // Themed color for the title
                        }}
                    >
                        {title}
                    </Typography>

                    {/* Display the card description */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontStyle: 'italic', // Italicized description text
                        }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </Card>
        </RouterLink>
    );
}

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired, // The title displayed on the card
    description: PropTypes.string.isRequired, // The description displayed on the card
    colorKey: PropTypes.string, // The key used to fetch colors from the theme palette
    to: PropTypes.string.isRequired, // The navigation link for the card
};

export default FeatureCard;
