import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const Content = (props: {
    type: IconLightType,
    width?: number
}) => {
    const {width, type} = props;
    return (
        <img alt={''} src={'/images/icon/Light/' + type} width={width || 25}/>
    );
}
type IconLightType = 'Arrow - Right.png' | 'Arrow - Right 2.png' | 'Search.svg'
    | 'Reload.svg' | 'Group.svg' | 'Profile.svg' | 'Notification.svg' | 'Support.svg'
    | 'Location.svg' | 'Paper.svg'| 'Calendar.svg' | 'Excel-Golf.svg' | 'EditGolf.svg' | 'keyboard.svg' | 'ticket-star.svg' | 'money.svg'
    |'Stock.svg';

interface Props extends Partial<CustomIconComponentProps> {
    type: IconLightType,
    width?: number
}

export const IconlyLight = (props: Props) => (
    <Icon component={() => <Content type={props.type} width={props.width}/>} {...props} />
);



