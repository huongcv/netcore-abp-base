import { Button, Col, Form, Row } from "antd";
import { useTranslation } from "react-i18next";

export const SaveBtnGroup = () => {
    const [t] = useTranslation('order');
    return (<div className='btn-save-group'>
        <Row gutter={12} className={'mt-2'}>
            <Col span={24}>
                <Button className={'w-full'} type={'primary'}>
                    {t('save')}
                </Button>
            </Col>
        </Row>
    </div>);
}
