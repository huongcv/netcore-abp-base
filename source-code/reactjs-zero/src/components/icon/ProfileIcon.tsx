import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path
                d="M7.99682 13.1747C3.68382 13.1747 -0.000183105 13.8547 -0.000183105 16.5747C-0.000183105 19.2957 3.66082 19.9997 7.99682 19.9997C12.3098 19.9997 15.9938 19.3207 15.9938 16.5997C15.9938 13.8787 12.3338 13.1747 7.99682 13.1747Z"
                fill="#636363"/>
            <path opacity="0.4"
                  d="M7.99683 10.5838C10.9348 10.5838 13.2888 8.22876 13.2888 5.29176C13.2888 2.35476 10.9348 -0.000244141 7.99683 -0.000244141C5.05983 -0.000244141 2.70483 2.35476 2.70483 5.29176C2.70483 8.22876 5.05983 10.5838 7.99683 10.5838Z"
                  fill="#636363"/>
        </svg>
    );
}

export const ProfileIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);
