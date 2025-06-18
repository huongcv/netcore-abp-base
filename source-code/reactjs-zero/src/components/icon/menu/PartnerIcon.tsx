import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (


        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M9.59151 15.207C13.2805 15.207 16.4335 15.766 16.4335 17.999C16.4335 20.232 13.3015 20.807 9.59151 20.807C5.90151 20.807 2.74951 20.253 2.74951 18.019C2.74951 15.785 5.88051 15.207 9.59151 15.207Z"
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M9.59157 12.02C7.16957 12.02 5.20557 10.057 5.20557 7.635C5.20557 5.213 7.16957 3.25 9.59157 3.25C12.0126 3.25 13.9766 5.213 13.9766 7.635C13.9856 10.048 12.0356 12.011 9.62257 12.02H9.59157Z"
                 stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M16.4829 10.8818C18.0839 10.6568 19.3169 9.28277 19.3199 7.61977C19.3199 5.98077 18.1249 4.62077 16.5579 4.36377"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path
                d="M18.5952 14.7324C20.1462 14.9634 21.2292 15.5074 21.2292 16.6274C21.2292 17.3984 20.7192 17.8984 19.8952 18.2114"
               stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>


    );
}

export const PartnerIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
