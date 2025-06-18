import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Svg = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 19 21" fill="none">
        <path
            d="M15.8889 8.55371C15.8889 16.5728 17.0432 20.1975 9.27942 20.1975C1.51466 20.1975 2.69276 16.5728 2.69276 8.55371"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.3653 5.47961H1.21484" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
              stroke-linejoin="round"/>
        <path
            d="M12.7158 5.47958C12.7158 5.47958 13.2444 1.71387 9.29009 1.71387C5.33676 1.71387 5.86533 5.47958 5.86533 5.47958"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
);

const DeleteIcon2 = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={Svg} {...props} />
);

export default DeleteIcon2;
