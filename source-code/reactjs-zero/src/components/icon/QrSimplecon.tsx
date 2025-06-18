import {CustomIconComponentProps} from "@ant-design/icons/es/components/Icon";
import * as React from "react";
import Icon from '@ant-design/icons';


export const QrSimpleIcon = (props: Partial<CustomIconComponentProps>) => {
    const SvgIcon = (prop: React.HTMLAttributes<SVGElement>) => (
        <>
            <img
                style={{
                    width: prop.style?.width || props.width || 25,
                    height: prop.style?.height || props.height || 25,
                    display: 'inline-block',
                    ...prop.style,
                }}
                src="/icon-svg/qr-simple.svg"
                alt="image"/>
        </>
    );
        return <Icon width={props.width ?? 25}  component={SvgIcon} {...props} />
    }
;
