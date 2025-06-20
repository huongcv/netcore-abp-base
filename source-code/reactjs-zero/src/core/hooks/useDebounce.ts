import {useEffect, useMemo} from 'react';
import {debounce} from "lodash";

export const useDebounce = (callback: () => void, delay: number, deps: any[]) => {
    const debouncedCallback = useMemo(
        () => debounce(callback, delay),
        [callback, delay]
    );

    useEffect(() => {
        return () => {
            debouncedCallback.cancel();
        };
    }, [debouncedCallback]);

    useEffect(() => {
        debouncedCallback();
    }, deps);
};
