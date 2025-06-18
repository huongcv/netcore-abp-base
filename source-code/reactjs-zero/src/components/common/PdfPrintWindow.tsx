import React, {useEffect, useRef} from "react";

declare var ord: any;

export const PdfPrintWindow = () => {
    const iframeRef = useRef(null);
    useEffect(() => {
        ord.event.on('print_pdf', (resultBlob: any) => {
            if (!!iframeRef && resultBlob) {
                // Gán URL PDF vào iframe để hiển thị
                // @ts-ignore
                iframeRef.current.src = URL.createObjectURL(resultBlob);
                // Tự động bật cửa sổ in
                setTimeout(() => {
                    // @ts-ignore
                    iframeRef.current.contentWindow.focus(); // Focus vào iframe
                    // @ts-ignore
                    iframeRef.current.contentWindow.print(); // Tự động mở chế độ in
                }, 500); // Đợi file load xong, sau đó in
            }
        })
    }, []);
    return (<iframe hidden
                    ref={iframeRef}
                    width="100%"
                    height="600px"
                    title="PDF Viewer"
                    style={{border: 'none'}}
    />);
}
