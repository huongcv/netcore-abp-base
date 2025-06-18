import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import Icon from "@ant-design/icons";

const StockMenuSvg = () => {
    return (<svg className="svg-icon"
                 width={20}
                fill={'#000'}
                 viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M764 459h119L512 128 141 459h119v306.845C260 794.649 283.343 818 312.138 818h399.724C740.657 818 764 794.65 764 765.845V459z m60 60v246.845C824 827.782 773.799 878 711.862 878H312.138C250.2 878 200 827.782 200 765.845V519h-59c-55.117 0-81.072-68.078-39.944-104.771l371-331c22.759-20.305 57.13-20.305 79.888 0l371 331C964.072 450.922 938.117 519 883 519h-59z"/>
        <path
            d="M291 864.5V651.285h213.043V864.5H291z m228-0.285V651h213.043v213.215H519z m0-231V420h213.043v213.215H519zM350.79 804.723h93.67V710.94h-93.67v93.783z m233-0.285h93.67v-93.784h-93.67v93.784z m-5-231h93.67v-93.784h-93.67v93.784z"/>
    </svg>);
}

export const StockMenuIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={StockMenuSvg} {...props} />
);
