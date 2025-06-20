import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (

        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.07861 16.1353H14.8936"stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M2.3999 13.713C2.3999 8.082 3.0139 8.475 6.3189 5.41C7.7649 4.246 10.0149 2 11.9579 2C13.8999 2 16.1949 4.235 17.6539 5.41C20.9589 8.475 21.5719 8.082 21.5719 13.713C21.5719 22 19.6129 22 11.9859 22C4.3589 22 2.3999 22 2.3999 13.713Z"
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>

    );
}

export const StockIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
