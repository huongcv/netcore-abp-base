import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (

        <svg width="24" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M16.5139 21.4998H8.16604C5.09968 21.4998 2.74727 20.3922 3.41547 15.9346L4.1935 9.89339C4.6054 7.66913 6.02416 6.81787 7.26901 6.81787H17.4475C18.7107 6.81787 20.047 7.7332 20.523 9.89339L21.3011 15.9346C21.8686 19.8888 19.5802 21.4998 16.5139 21.4998Z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M16.6512 6.59824C16.6512 4.21216 14.7169 2.27787 12.3309 2.27787V2.27787C11.1819 2.273 10.0782 2.72603 9.26406 3.53679C8.44987 4.34754 7.99218 5.44923 7.99219 6.59824H7.99219"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15.2965 11.1017H15.2507"stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
            <path d="M9.4659 11.1017H9.42013"stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>


    );
}

export const SaleIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
