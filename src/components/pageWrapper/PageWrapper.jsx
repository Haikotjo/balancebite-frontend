import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * PageWrapper Component
 * A layout wrapper that centers its children both vertically and horizontally.
 * It also allows for customization of padding and text alignment.
 *
 * Props:
 * - `children`: The content to be rendered inside the wrapper.
 * - `padding`: Padding applied to the wrapper. Accepts a number or a string.
 * - `textAlign`: Alignment of text content. Default is 'center'.
 */
const PageWrapper = ({ children, padding = 2, textAlign = 'center' }) => {
    return (
        <Box
            sx={{
                display: 'flex', // Enables flexbox for centering
                flexDirection: 'column', // Arranges children in a column layout
                alignItems: 'center', // Horizontally centers children
                justifyContent: 'center', // Vertically centers children
                padding, // Customizable padding
                textAlign, // Customizable text alignment
            }}
        >
            {children}
        </Box>
    );
};

PageWrapper.propTypes = {
    children: PropTypes.node.isRequired, // The content to be rendered inside the wrapper
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Padding value (e.g., 2 or '16px')
    textAlign: PropTypes.string, // Text alignment (e.g., 'center', 'left', 'right')
};

export default PageWrapper;
