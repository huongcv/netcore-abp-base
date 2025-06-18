import {Button, Col, Row} from "antd";
import {CallingIcon} from "@ord-components/icon/CallingIcon";
import {DownloadIcon} from "@ord-components/icon/DownloadIcon";

function SupportCard() {
    return <div>
        <Row gutter={[16, 16]}>
            <Col span={12}>
                <div className={'card-hotline px-3 h-full d-flex items-center'}>
                    <Row>
                        <Col span={24}>
                            <p className={'title-light mb-2'}>Hướng dẫn sử dụng phần mềm</p>
                        </Col>
                        <p className={'title-light font-extrabold phone'}><CallingIcon/> 0983.542.221</p>
                    </Row>
                </div>
            </Col>
            <Col span={12}>
                <div className={'card-download h-full d-flex items-center content-center'}
                     style={{textAlign: 'center'}}>
                    <Row className={'d-flex content-center'}>
                        <p className={'title-dark mb-2 font-bold text-16'}>Tải công cụ hỗ trợ từ xa</p>
                        <Button
                            type="primary"
                            href="https://www.ultraviewer.net/vi/download.html"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <DownloadIcon /> Tải về
                        </Button>
                    </Row>
                </div>
            </Col>
            {/*<Col span={24}>
                <div className={'card-app h-full d-flex items-center content-right'}
                     style={{textAlign: 'center'}}>
                    <Row className={'w-2/3 d-flex content-right mr-5'}>
                        <Col span={24}>
                            <p className={'title-gray mb-2 font-semibold text-16'}>Tải ứng dụng trên điện thoại</p>
                        </Col>
                        <Col span={12} className={'content-center'} style={{display: 'grid'}}>
                            <img src={'/images/qr.png'}/>
                            <p className={'text-14 title-gray font-medium'}>Android</p>
                        </Col>
                        <Col span={12} className={'content-center'} style={{display: 'grid'}}>
                            <img src={'/images/qr.png'}/>
                            <p className={'text-14 title-gray font-medium'}>IOS</p>
                        </Col>
                    </Row>
                </div>
            </Col>*/}
        </Row>
    </div>
}

export default SupportCard
