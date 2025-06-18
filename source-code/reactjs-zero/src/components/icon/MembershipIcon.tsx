import { CustomIconComponentProps } from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="14" rx="2" fill="white" stroke="black" stroke-width="1.5" />
            <circle cx="7" cy="11" r="3" fill="black" />
            <line x1="12" y1="8" x2="18" y2="8" stroke="black" stroke-width="1.5" />
            <line x1="12" y1="11" x2="18" y2="11" stroke="black" stroke-width="1.5" />
            <line x1="12" y1="14" x2="18" y2="14" stroke="black" stroke-width="1.5" />
        </svg>

    );
}

export const MembershipIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);