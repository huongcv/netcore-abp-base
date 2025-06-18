import {observer} from "mobx-react-lite";
import {Space} from "antd";
import {useSelectProvince} from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import DisplayTextFormSelectDataSource from "@ord-components/forms/select/DisplayTextFormSelectDataSource";
import {useSelectDistrict} from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import {useSelectCommune} from "@ord-components/forms/select/selectDataSource/useSelectCommune";
import * as React from "react";

const AddressCell = (props: {
    maTinh?: string;
    maHuyen?: string;
    maXa?: string;
    separator?: string;
    separatorClassName?: string;
}) => {
    const {maTinh, maHuyen, maXa} = props;
    const communeDatasource = useSelectCommune(maHuyen || '');
    const districtDatasource = useSelectDistrict(maTinh || '');
    const defaultSeparator = (<span className={props.separatorClassName || 'mx-1'}> {props.separator || '-'} </span>);
    return (<Space>
        <Space.Compact direction='horizontal'>
            {
                (!!maXa) && (
                    <>
                        <Space>
                            <DisplayTextFormSelectDataSource value={maXa}
                                                             datasource={communeDatasource}/>
                        </Space>
                        {props.separator || defaultSeparator}
                    </>
                )
            }
            {
                (!!maHuyen) && (
                    <>
                        <Space>
                            <DisplayTextFormSelectDataSource value={maHuyen}
                                                             datasource={districtDatasource}/>

                        </Space>
                        {props.separator || defaultSeparator}
                    </>
                )
            }
            <Space>
                <DisplayTextFormSelectDataSource value={maTinh}
                                                 datasource={useSelectProvince()}/>
            </Space>

        </Space.Compact>
    </Space>);
}
export default observer(AddressCell);
