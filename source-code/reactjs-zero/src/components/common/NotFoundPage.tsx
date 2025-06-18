import {Button, Result} from "antd";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const {t} = useTranslation(['common']);
    const navigate = useNavigate();
    return (
        <Result
            status="404"
            title={t('pages.404.title')}
            subTitle={t('pages.404.subTitle')}
            extra={
                <Button type="primary" onClick={() => navigate('/')}>
                    {t('pages.404.buttonText')}
                </Button>
            }
        />
    );
};

export default NotFoundPage;
