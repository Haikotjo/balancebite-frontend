import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useTheme } from '@mui/material/styles';

const FeatureList = () => {
    const theme = useTheme();

    const features = [
        { primary: "Create and save meals", secondary: "Plan your meals based on your goals." },
        { primary: "Add meals from others", secondary: "Discover and use shared meals." },
        { primary: "Monitor your daily intake", secondary: "Track fats, proteins, and carbohydrates easily." },
        { primary: "Set your Recommended Daily Intake (RDI)", secondary: "Personalized intake based on weight, age, and goals." },
        { primary: "Eat meals with a single click", secondary: "See your intake update automatically." },
    ];

    return (
        <List
            sx={{
                maxWidth: 800,
                width: "100%",
                textAlign: "left",
            }}
        >
            {features.map((feature, index) => (
                <ListItem key={index}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                        <FiberManualRecordIcon sx={{ color: theme.palette.primary.main, fontSize: "small" }} />
                    </ListItemIcon>
                    <ListItemText
                        primary={<strong>{feature.primary}</strong>}
                        secondary={feature.secondary}
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default FeatureList;
