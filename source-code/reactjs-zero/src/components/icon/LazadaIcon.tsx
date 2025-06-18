import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const LazadaSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/lazada.svg"
            alt="image"
        />
    </>
);
export const LazadaIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={LazadaSvg} {...props} />
);
