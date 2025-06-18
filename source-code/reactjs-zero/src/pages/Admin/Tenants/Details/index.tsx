import {observer} from "mobx-react-lite";
import {useNavigate, useParams} from "react-router-dom";
import React, {Suspense, useEffect} from "react";
import {useStore} from "@ord-store/index";
import {TitleWithActionInRight} from "@ord-components/common/h-title/TitleWithActionInRight";
import {Button, Tabs, TabsProps} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import Shop from "@pages/Admin/Shop";
import UserListOfTenant from "@pages/Admin/Tenants/Details/UserListOfTenant";
import ShopInformation from "@pages/Admin/Tenants/Details/ShopInformation";
import PackageForTenant from "@pages/Admin/Tenants/Details/PackageForTenant";

const Index = () => {
    const {tenantListStore} = useStore();
    const navigate = useNavigate();
    const {t} = useTranslation('tenant-list');
    let {id} = useParams();
    useEffect(() => {
        if (id) {
            tenantListStore.getShopDetail(id).then();
        }
    }, [id]);
    const gotoList = () => {
        tenantListStore.shopDetail = null;
        tenantListStore.tenantDetail = null;
        navigate('/admin/tenant');
    }
    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: t('listShop'),
            children: <Shop tenant={{...tenantListStore.tenantDetail}}/>,
        },
        {
            key: '2',
            label: t('listUser'),
            children: <UserListOfTenant tenant={{...tenantListStore.tenantDetail}}/>,
        },
        {
            key: '3',
            label: t('packages'),
            children: <Suspense fallback={<> </>}><PackageForTenant tenantId={tenantListStore?.tenantDetail?.id || ''}/>
            </Suspense>,
        },
    ];
    return (<>
        <TitleWithActionInRight title={t('DetailTitle', {
            name: tenantListStore.shopDetail?.name
        })}>
            <Button onClick={gotoList} icon={<ArrowLeftOutlined/>}>
                {t('actionBtn.back')}
            </Button>
        </TitleWithActionInRight>
        <div className='ord-container-box'>
            <ShopInformation/>
        </div>
        <div className='ord-container-box'>
            {
                tenantListStore.tenantDetail && <Tabs defaultActiveKey="1" items={tabItems}/>
            }
        </div>


    </>);
}
export default observer(Index);
