import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M19.7389 6.15368C19.7389 3.40281 17.8582 2.30005 15.1504 2.30005H8.79149C6.16693 2.30005 4.20001 3.32762 4.20001 5.97022V20.694C4.20001 21.4198 4.98096 21.877 5.61355 21.5221L11.9955 17.9422L18.3223 21.5161C18.9559 21.873 19.7389 21.4158 19.7389 20.689V6.15368Z"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.27118 9.02811H15.5895" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                  strokeLinejoin="round"/>
        </svg>
    );
}

export const InvoiceIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
