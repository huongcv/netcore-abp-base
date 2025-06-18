import {useEffect, useRef} from 'react';

const useAutoFocus = () => {
    const inputRef = useRef(null); // Tạo ref cho input

    useEffect(() => {
        if (inputRef.current) {
            // @ts-ignore
            inputRef.current.focus(); // Focus vào input khi component render
        }
    }, []);

    return inputRef;
};

export default useAutoFocus;
