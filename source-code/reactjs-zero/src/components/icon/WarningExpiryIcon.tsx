import {CustomIconComponentProps} from "./CustomIconComponentProps";
import Icon from "@ant-design/icons";

const WarningSvg = (data: any) => (
    <>
        <svg width="1em" height="1em" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="22" fill="#EDEDED"/>
            <g clip-path="url(#clip0_2758_2257)">
                <g clip-path="url(#clip1_2758_2257)">
                    <path
                        d="M33.6174 28.5332L24.444 12.6444C23.9339 11.7609 23.0203 11.2334 22 11.2334C20.9798 11.2334 20.0661 11.7609 19.556 12.6444L10.3826 28.5332C9.87247 29.4168 9.87247 30.4718 10.3826 31.3553C10.8927 32.2388 11.8063 32.7663 12.8266 32.7663H31.1734C32.1936 32.7663 33.1072 32.2388 33.6174 31.3553C34.1276 30.4718 34.1276 29.4168 33.6174 28.5332ZM32.3997 30.6523C32.1437 31.0957 31.6853 31.3603 31.1734 31.3603H12.8266C12.3146 31.3603 11.8562 31.0957 11.6003 30.6523C11.3443 30.209 11.3443 29.6797 11.6003 29.2363L20.7737 13.3475C21.0297 12.9042 21.4881 12.6395 22 12.6395C22.5119 12.6395 22.9704 12.9042 23.2263 13.3475L32.3997 29.2363C32.6556 29.6797 32.6556 30.209 32.3997 30.6523Z"
                        fill="#4F5052"/>
                    <path
                        d="M21.2969 18.2505H22.703V25.2809H21.2969V18.2505ZM22 26.6871C21.4831 26.6871 21.0626 27.1076 21.0626 27.6245C21.0626 28.1413 21.4831 28.5619 22 28.5619C22.5168 28.5619 22.9374 28.1413 22.9374 27.6245C22.9374 27.1076 22.5169 26.6871 22 26.6871Z"
                        fill="#4F5052"/>
                </g>
            </g>
            <defs>
                <clipPath id="clip0_2758_2257">
                    <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
                </clipPath>
                <clipPath id="clip1_2758_2257">
                    <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
                </clipPath>
            </defs>
        </svg>
    </>
);
export const WarningIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={WarningSvg} {...props} />
);


