import { UserIcon } from "@ord-components/icon/UserIcon";
import { Avatar } from "antd";
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

const PartnerClassWithAvatar = (props: { partnerClass?: string, isActive?: boolean }) => {
    const [partnerClass, setPartnerClass] = useState<any>("Member");

    useEffect(() => {
        setPartnerClass(props.partnerClass);
    }, [props.partnerClass]);

    const { t } = useTranslation('customer');

    const PartnerClass = () => {
        const commonStyle: React.CSSProperties = {
            margin: '-17px auto',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '96px',
            height: '26px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
        };

        switch (partnerClass) {
            case "Silver":
                return (
                    <div style={{
                        ...commonStyle,
                        background: 'linear-gradient(135deg, #B0B7C3 0%, #6B7280 100%)', 
                        color: '#F9FAFB', 
                    }}>
                        {t('Silver')}
                    </div>
                );
            case "Gold":
                return (
                    <div style={{
                        ...commonStyle,
                        background: 'linear-gradient(135deg, #FBBF24 0%, #D97706 100%)', 
                        color: '#1F2937',
                    }}>
                        {t('Gold')}
                    </div>
                );
            case "Diamond":
                return (
                    <div style={{
                        ...commonStyle,
                        background: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)', 
                        color: '#FFFFFF',
                    }}>
                        {t('Diamond')}
                    </div>
                );
            case "Platinum":
                return (
                    <div style={{
                        ...commonStyle,
                        background: 'linear-gradient(135deg, #D1D5DB 0%, #6B7280 100%)', 
                        color: '#111827', 
                    }}>
                        {t('Platinum')}
                    </div>
                );
            default:
                return (
                    <div style={{
                        ...commonStyle,
                        background: 'linear-gradient(135deg, #4B5563 0%, #1F2937 100%)',
                        color: '#D1D5DB',
                    }}>
                        {t('Member')}
                    </div>
                );
        }
    };

    return (
        <div style={{ position: 'relative' }}>
             <Avatar size={150}
                    style={{borderColor: props.isActive ? "#1AB01A": ""}}
                    icon={<UserIcon style={{marginTop: '13px'}}/>}> </Avatar>
            <PartnerClass />
        </div>
    );
};

export default PartnerClassWithAvatar;