import {useRef} from "react";

export const useEnterToNext = (inputsCount: number) => {
    const inputsRef = useRef([]);

    const handleKeyPress = (e:any, index: number) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            const nextInput = inputsRef.current[index + 1];
            if (nextInput) {
                // @ts-ignore
                nextInput.focus(); // Focus on the next input
            }
        }
    };

    const registerInput = (index:any) => (inputElement:any) => {
        // @ts-ignore
        inputsRef.current[index] = inputElement;
    };

    const handleFocus = (index:any) => {
        // @ts-ignore
        inputsRef.current[index]?.focus();
    };

    return { handleKeyPress, registerInput, handleFocus, inputsRef };
}