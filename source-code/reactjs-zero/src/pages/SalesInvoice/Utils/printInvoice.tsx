import React, {useEffect, useRef} from "react";
import UiUtils from "@ord-core/utils/ui.utils";

export const PrintInvoice = (
    props: {
        pdfUrl: any
    },
) => {
    const frameRef = useRef<any>();
    useEffect(() => {
        if(props.pdfUrl) {
            frameRef.current.onload = () => {
                frameRef.current.contentWindow.focus();
                frameRef.current.contentWindow.print();
            }
            UiUtils.clearBusy();
        }
    }, [props.pdfUrl]);
    return <>
        {
            props.pdfUrl && <iframe
                hidden
                ref={frameRef}
                src={props.pdfUrl}
                title="PDF Viewer"
                style={{border: 'none'}}
            />
        }</>
}