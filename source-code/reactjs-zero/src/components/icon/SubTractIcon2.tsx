import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" fill="none">
        <path
            d="M15.8939 29.3332C23.2272 29.3332 29.2272 23.3332 29.2272 15.9998C29.2272 8.6665 23.2272 2.6665 15.8939 2.6665C8.56055 2.6665 2.56055 8.6665 2.56055 15.9998C2.56055 23.3332 8.56055 29.3332 15.8939 29.3332Z"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M10.5605 16H21.2272" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
    </svg>
);

const SubTractIcon2 = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);

export default SubTractIcon2;
