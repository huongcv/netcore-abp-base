// Hook
import {useLocation} from "react-router-dom";

export function useParentPath(): string {
    const location = useLocation();
    const parts = location.pathname.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
}


