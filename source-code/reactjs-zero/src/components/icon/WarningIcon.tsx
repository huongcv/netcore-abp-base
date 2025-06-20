import {CustomIconComponentProps} from "./CustomIconComponentProps";
import Icon from "@ant-design/icons";

const WarningSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/warning.svg"
            alt="image"/>
    </>
);
export const WarningIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={WarningSvg} {...props} />
);
