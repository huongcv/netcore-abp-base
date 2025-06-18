import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" fill="none">
        <path
            d="M15.9993 29.3332C23.3327 29.3332 29.3327 23.3332 29.3327 15.9998C29.3327 8.6665 23.3327 2.6665 15.9993 2.6665C8.66602 2.6665 2.66602 8.6665 2.66602 15.9998C2.66602 23.3332 8.66602 29.3332 15.9993 29.3332Z"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.666 16H21.3327" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path d="M16 21.3332V10.6665" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
    </svg>
);

const AddIcon2 = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);

export default AddIcon2;
