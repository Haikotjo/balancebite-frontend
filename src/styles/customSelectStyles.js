// const customSelectStyles = (theme) => {
//     const isDarkMode = theme.palette.mode === 'dark';
//
//     return {
//         control: (base) => ({
//             ...base,
//             backgroundColor: isDarkMode ? '#2d2f39' : '#FFFFFF',
//             borderWidth: '1px',
//             borderStyle: 'solid',
//             color: theme.palette.text.primary,
//             borderColor: theme.palette.primary.main,
//             boxShadow: 'none',
//             '&:hover': {
//                 borderColor: theme.palette.primary.dark,
//             },
//             fontSize: '0.9rem',
//             minHeight: '40px',
//         }),
//
//         menu: (base) => ({
//             ...base,
//             backgroundColor: isDarkMode ? '#2d2f39' : '#FFFFFF',
//             color: theme.palette.text.primary,
//             zIndex: 9999,
//             position: 'absolute',
//             border: `1px solid ${theme.palette.primary.main}`,
//         }),
//
//         option: (base, state) => ({
//             ...base,
//             fontSize: "0.85rem",
//             backgroundColor: state.isSelected
//                 ? theme.palette.primary.main
//                 : state.isFocused
//                     ? theme.palette.primary.main
//                     : isDarkMode ? '#2d2f39' : '#FFFFFF',
//             color: (state.isSelected || state.isFocused)
//                 ? theme.palette.text.light
//                 : theme.palette.text.primary,
//             '&:active': {
//                 backgroundColor: theme.palette.primary.main,
//             },
//         }),
//
//         multiValue: (base) => ({
//             ...base,
//             backgroundColor: theme.palette.primary.main,
//         }),
//         multiValueLabel: (base) => ({
//             ...base,
//             color: theme.palette.text.light,
//         }),
//         multiValueRemove: (base) => ({
//             ...base,
//             color: theme.palette.text.light,
//             ':hover': {
//                 backgroundColor: theme.palette.primary.main,
//                 color: '#fff',
//             },
//         }),
//         placeholder: (base) => ({
//             ...base,
//             color: theme.palette.mode === "dark" ? "#ffffff" : "#7a7c8b",
//         }),
//         singleValue: (base) => ({
//             ...base,
//             color: theme.palette.text.primary,
//         }),
//         input: (base) => ({
//             ...base,
//             color: theme.palette.text.primary,
//         }),
//
//     };
// };
//
// export default customSelectStyles;
