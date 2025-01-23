import PropTypes from "prop-types";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, useTheme } from "@mui/material";

const NutritionTable = ({ sortedNutrients, useBaseRDI }) => {
    const theme = useTheme();

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    {sortedNutrients.map((nutrient) => {
                        const isSubNutrient = [
                            "Saturated and Trans fats",
                            "Mono- and Polyunsaturated fats",
                        ].includes(nutrient.name);

                        const textColor =
                            !useBaseRDI && nutrient.value < 0 ? theme.palette.error.main
                                : !useBaseRDI ? theme.palette.success.main
                                    : "inherit";

                        return (
                            <TableRow key={nutrient.id}>
                                <TableCell
                                    sx={{
                                        paddingLeft: isSubNutrient ? "20px" : "0",
                                        fontStyle: isSubNutrient ? "italic" : "normal",
                                        color: textColor,
                                    }}
                                >
                                    {nutrient.name}
                                </TableCell>
                                <TableCell align="right" sx={{ color: textColor }}>
                                    {nutrient.value || "N/A"}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

NutritionTable.propTypes = {
    sortedNutrients: PropTypes.array.isRequired,
    useBaseRDI: PropTypes.bool.isRequired,
};

export default NutritionTable;
