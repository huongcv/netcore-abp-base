import {Button, Col, Form, FormInstance, Input, Row, Space, Table, TableColumnsType} from "antd";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {observer} from "mobx-react-lite";
import TableUtil from "@ord-core/utils/table.util";
import {useDayOfWeek} from "@ord-components/forms/select/selectDataSource/useDayOfWeek";
import {useStore} from "@ord-store/index";
import {withDataTableFetching} from "@ord-core/hoc/withDataTableFetching";
import {TableProps} from "antd/es/table/InternalTable";
import {
    DataWarningProductStatusDto,
    ProductPriceListDetailDto,
    ShopWorkCalendarDetailDto,
    ShopWorkCalendarDto
} from "@api/index.defs";
import {TableRowSelection} from "antd/es/table/interface";
import shopWorkCalendarDetailStore from "@ord-store/WorkShift/shopWorkCalendarDetailStore";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {useEffect} from "react";
import {runInAction} from "mobx";

const ListWorkCalendarDetail = (props: {
    calendarId?:string
    form?:FormInstance
    // form: FormInstance
}) => {
    const {t} = useTranslation('shop-work-calendar');
    const {t:tEnum} = useTranslation('enum');
    const {shopWorkCalendarDetailStore:mainStore } = useStore();


    useEffect(() => {
        if(mainStore){
            mainStore.getPagedList(props.calendarId).then()
        }
    }, []);

    const UseEnumDayOfWeek =useDayOfWeek()
    const columns: TableColumnsType<any> = TableUtil.getColumns([
         {
             dataIndex: 'name',
             width: '200px',
             title: t('ngayLamViec'),
             // do tên của calendar Detail là tên enum thứ trong tuần nên sẽ lấy bản dịch của enum
             render: value => {
                 return <span> {tEnum(value)}</span>
             }
         },
         {
             dataIndex: 'hourFrom',
             title:  t('hourFrom'),
             width: '120px',
             align:"center"
         },
        {
            dataIndex: 'hourFrom',
            title:  t('thoiGianNghiGiuaGio'),
            width: '220px',
            render: (data:number, record: ShopWorkCalendarDetailDto)=>{
                return <span> {record.hourBreakTimeFrom} - {record.hourBreakTimeTo}</span>
            },
            align:"center"
        },



        {
             dataIndex: 'hourTo',
             title:  t('hourTo'),
             width: '120px',
            align:"center"
         },

     ], { }, true)
    const setValueForm= async (record:ShopWorkCalendarDetailDto, index?:number)=>{
        props.form?.setFieldsValue(record)
        props.form?.setFieldValue("index", index)

        runInAction(() => {
            mainStore.setItemSelected(record)
            mainStore.setIsEdit()
        })

    }

     return (
        <>

            <Table<ShopWorkCalendarDetailDto>
                rowKey="id"
                dataSource={mainStore.dataList} columns={columns}
                                              onRow={(record, rowIndex) => {
                                                  return {
                                                      onClick:()=>{setValueForm(record, rowIndex).then()} ,
                                                  };
                                              }}
                                            pagination={false}/>

        </>
  )
}

export default observer(ListWorkCalendarDetail);
