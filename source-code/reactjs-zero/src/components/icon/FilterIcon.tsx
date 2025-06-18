import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const FilterSvg = (data: any) => (
    <>
        <img
            src="/icon-svg/filter.svg"
            alt="image"
        />
    </>
);
export const FilterIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={FilterSvg} {...props} />
);
