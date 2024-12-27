import {alpha, Card, CardContent, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from "prop-types";

function FeatureCard({ title, description, colorKey }) {
    const theme = useTheme();
    const color = theme.palette[colorKey]?.main || theme.palette.text.primary;

    return (
        <Card
            sx={{
                maxWidth: 300,
                borderRadius: 2,
                boxShadow: 3,
                border: `2px solid ${theme.palette[colorKey]?.main || theme.palette.grey[200]}`,
                backgroundColor: alpha(theme.palette[colorKey]?.main || theme.palette.grey[200], 0.15),
                transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: 6,
                },
            }}
        >
            <CardContent>
                <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                        fontFamily: "'Pacifico', cursive",
                        color: color,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontStyle: 'italic',
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
}

FeatureCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    colorKey: PropTypes.string,
};

export default FeatureCard;
