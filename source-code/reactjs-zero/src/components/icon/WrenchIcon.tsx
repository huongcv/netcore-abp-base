import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const WrenchSvg = (data: any) => (
    <>
        <img
            width={24} height={24}
            src="/icon-svg/wrench.svg"
            alt="image"
        />
    </>
);
export const WrenchIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={WrenchSvg} {...props} />
);
