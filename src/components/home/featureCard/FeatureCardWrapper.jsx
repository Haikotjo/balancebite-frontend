import { Grid, Tooltip, Box } from '@mui/material';
import PropTypes from 'prop-types';

function FeatureCardWrapper({ tooltip, children }) {
    return (
        <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                margin: 'auto',
                padding: '15px',
            }}
        >
            <Tooltip title={tooltip} arrow>
                {/* Wrap children in a Box to ensure a single React element */}
                <Box>
                    {children}
                </Box>
            </Tooltip>
        </Grid>
    );
}

FeatureCardWrapper.propTypes = {
    tooltip: PropTypes.string.isRequired, // Tooltip text
    children: PropTypes.node.isRequired, // Content inside the wrapper
};

export default FeatureCardWrapper;
