import React, {memo, useMemo} from 'react';
import {useStore} from "@ord-store/index";
import OrdCrudPage from "@ord-components/crud/OrdCrudPage";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {Form} from 'antd';
import TableUtil from "@ord-core/utils/table.util";
import {ShopPackageRegistrationDto} from "@api/index.defs";
import DateCell from "@ord-components/table/cells/DateCell";
import {PriceCell} from "@ord-components/table/cells/priceCell";
import PackageStatusCell from "@pages/Admin/Utils/PackageStatusCell";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {ColSpanResponsive} from "@ord-components/common/ColSpanResponsive";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectPackageStatus} from "@ord-components/forms/select/selectDataSource/useSelectPackageStatus";

type PackageForTenantProps = {
    tenantId: string;
}

const FormSearch = (props: { tenantId: string }) => <>
    <ColSpanResponsive span={4}>
        <FloatLabel label='Trạng thái'>
            <Form.Item name="status">
                <OrdSelect allowClear datasource={useSelectPackageStatus()}/>
            </Form.Item>
        </FloatLabel>
    </ColSpanResponsive>
    <SearchFilterText placeHolder='Nhập tên gói cước, tên cửa hàng, mã cửa hàng để tìm kiếm' span={12}/>
    <div hidden>
        <Form.Item name='tenantId' initialValue={props.tenantId}/>
    </div>
</>

const PackageForTenant = (props: PackageForTenantProps) => {
    const {tenantId} = props;
    const {packageForTenantStore: mainStore} = useStore();

    const columns = useMemo(() => TableUtil.getColumns<ShopPackageRegistrationDto>([
        {
            title: 'shopCode',
            dataIndex: 'shopCode',
            width: 130,
        },
        {
            title: 'shopName',
            dataIndex: 'shopName',
            width: 130,
        },
        {
            title: 'packageRegistrationName',
            dataIndex: 'packageRegistrationName',
            width: 150,
        },
        {
            title: 'packageAccountNumber',
            dataIndex: 'packageAccountNumber',
            width: 120,
            align: 'right',
        },
        {
            title: 'packageShopNumber',
            dataIndex: 'packageShopNumber',
            width: 120,
            align: 'right',
        },
        {
            title: 'packageRegistrationStartDate',
            dataIndex: 'packageRegistrationStartDate',
            width: 120,
            align: 'right',
            render: (_) =>
                _ ? <DateCell date={_} format="DD/MM/YYYY"></DateCell> : "",
        },
        {
            title: 'packageRegistrationExpiryDate',
            dataIndex: 'packageRegistrationExpiryDate',
            width: 120,
            align: 'right',
            render: (_) =>
                _ ? <DateCell date={_} format="DD/MM/YYYY"></DateCell> : "",
        },
        {
            title: 'totalAmount',
            dataIndex: 'totalAmount',
            width: 150,
            align: 'right',
            render: (_) => <PriceCell value={_}/>
        },
        {
            title: 'status',
            dataIndex: 'status',
            width: 130,
            align: 'center',
            render: (_) => <PackageStatusCell status={_}/>
        }
    ], {
        ns: mainStore.getNamespaceLocale()
    }), []);

    return (
        < >
            <OrdCrudPage classNameTable=' -mt-8' stored={mainStore}
                         hiddenTopAction={true}
                         columns={columns}
                         searchForm={f => <FormSearch tenantId={tenantId}/>}
            ></OrdCrudPage>
        </>
    );
};

export default memo(PackageForTenant);
