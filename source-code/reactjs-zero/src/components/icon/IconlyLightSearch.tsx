import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24"
             fill="none"
             xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.7666" cy="11.7666" r="8.98856"
                    stroke="#323232" strokeWidth="1.5" strokeLinecap="round"
                    strokeLinejoin="round"/>
            <path d="M18.0183 18.4851L21.5423 22"
                  stroke="#323232" strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>

    );
}

export const IconlyLightSearch = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
