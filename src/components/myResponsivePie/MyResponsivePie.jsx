// MyResponsivePie.jsx
import { ResponsivePie } from '@nivo/pie';
import PropTypes from 'prop-types';

const MyResponsivePie = ({ data }) => {
    const macroColors = {
        fat: '#EDB6A3',     // Tailwind: secondary
        protein: '#46B1C9', // Tailwind: primary
        carbs: '#DD1155',   // Tailwind: error
    };

    return (
        <ResponsivePie
            data={data}
            colors={({ id }) => macroColors[id] || '#a1a1aa'} // fallback: grijs
            margin={{ top: 10, right: 80, bottom: 10, left: 80 }}
            innerRadius={0.5}
            padAngle={3}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#d1d5db" // text-gray-300
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="transparent"


        />
    );
};

MyResponsivePie.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            value: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default MyResponsivePie;
