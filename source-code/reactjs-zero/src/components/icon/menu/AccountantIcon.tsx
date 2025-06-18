import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Iconly/Light/Paper">
                <g id="Paper">
                    <path id="Stroke 1"
                          d="M14.7377 2.76181H8.08468C6.00468 2.75381 4.29968 4.41181 4.25068 6.49081V17.2038C4.20468 19.3168 5.87968 21.0678 7.99268 21.1148C8.02368 21.1148 8.05368 21.1158 8.08468 21.1148H16.0737C18.1677 21.0298 19.8177 19.2998 19.8027 17.2038V8.03781L14.7377 2.76181Z"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Stroke 3" d="M14.4751 2.75V5.659C14.4751 7.079 15.6231 8.23 17.0431 8.234H19.7981"
                          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Stroke 5" d="M14.2879 15.3585H8.88794" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                    <path id="Stroke 7" d="M12.243 11.606H8.88696" stroke="currentColor" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"/>
                </g>
            </g>
        </svg>


    );
}

export const AccountantIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
