// import { useRef } from "react";
//
// /**
//  * Custom hook for debouncing function calls.
//  * @param {Function} callback - The function to execute after debounce delay.
//  * @param {number} delay - Delay in milliseconds.
//  * @returns {Function} - Debounced function.
//  */
// const useDebounce = (callback, delay) => {
//     const timeoutRef = useRef(null);
//
//     return (...args) => {
//         if (timeoutRef.current) clearTimeout(timeoutRef.current);
//         timeoutRef.current = setTimeout(() => {
//             callback(...args);
//         }, delay);
//     };
// };
//
// export default useDebounce;
