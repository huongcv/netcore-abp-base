import React from 'react';
import {Avatar} from "antd";
import {UserIcon} from "@ord-components/icon/UserIcon";
import {useTranslation} from "react-i18next";

const PartnerAvatar = () => {
    const {t} = useTranslation('customer');
    
    return (
        <div style={{position: 'relative'}}>
            <Avatar size={150}
                    style={{borderColor: "#1AB01A"}}
                    icon={<UserIcon style={{marginTop: '13px'}}/>}> </Avatar>

        </div>
    );
};

export default PartnerAvatar;
