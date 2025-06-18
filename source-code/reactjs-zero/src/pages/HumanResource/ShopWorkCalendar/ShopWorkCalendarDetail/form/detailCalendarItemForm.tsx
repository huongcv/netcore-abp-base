import {Alert, Col, Form, FormInstance, Input, Modal, Row, Tabs, TimePicker, Typography} from "antd";
import {useTranslation} from "react-i18next";
import * as React from "react";
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {PriceNumberInput} from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectEmployee} from "@ord-components/forms/select/selectDataSource/useSelectEmployee";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdTimeInput from "@ord-components/forms/OrdTimeInput";
import {useDayOfWeek} from "@ord-components/forms/select/selectDataSource/useDayOfWeek";
import TextArea from "antd/lib/input/TextArea";
import {FooterCrudModal} from "@ord-components/crud/FooterCrudModal";
import UiUtils from "@ord-core/utils/ui.utils";
import {ShopWorkCalendarDetailDto} from "@api/index.defs";
import {useEffect} from "react";
import {runInAction} from "mobx";


const DetailCalendarItemForm = (props: {
    form: FormInstance

}) => {
    const {t} = useTranslation('shop-work-calendar');
    const {t:tEnum} = useTranslation('enum');

    const {shopWorkCalendarDetailStore: store}= useStore()
    const customValue = Form.useWatch((values) => `name: ${values.name || ''}`, props.form);
    const change=async ()=>{
        runInAction(() => {
            store.changeItemInIndex(props.form.getFieldsValue(),props.form.getFieldValue('index'))
        })


    }



     return <>
         <Form form={props.form} >
             {store.isEditItem &&
             <Row gutter={16}>
                 <Col span={24}>
                 <h1>  <Typography>
                     <pre>{t('ChinhSuathongTinNgay')}: <b> {tEnum(store.editItem?.name??'')}</b></pre>
                 </Typography> </h1>
                 </Col>
                 <Col span={12}>
                     <FloatLabel label={t('hourFrom')} required >
                         <Form.Item name='hourFrom' rules={[ValidateUtils.required]}>
                             <OrdTimeInput  allowClear={false} onChange={change} ></OrdTimeInput>
                         </Form.Item>
                     </FloatLabel>

                 </Col>
                 <Col span={12}>
                     <FloatLabel label={t('hourTo')} required >
                         <Form.Item name='hourTo' rules={[ValidateUtils.required]}>
                             <OrdTimeInput allowClear={false} onChange={change} ></OrdTimeInput>
                         </Form.Item>
                     </FloatLabel>

                 </Col>
                 <Col span={12}>
                     <FloatLabel label={t('hourBreakTimeFrom')} required >
                         <Form.Item name='hourBreakTimeFrom' rules={[ValidateUtils.required]}>
                             <OrdTimeInput allowClear={false} onChange={change} ></OrdTimeInput>
                         </Form.Item>
                     </FloatLabel>

                 </Col>
                 <Col span={12}>
                     <FloatLabel label={t('hourBreakTimeTo')} required >
                         <Form.Item name='hourBreakTimeTo' rules={[ValidateUtils.required]}>
                             <OrdTimeInput allowClear={false} onChange={change} ></OrdTimeInput>
                         </Form.Item>
                     </FloatLabel>

                 </Col>
             </Row>}
             <Form.Item hidden={true} name='name'>
                 <Input/>
             </Form.Item>
             <Form.Item hidden={true} name='id'>
                 <Input/>
             </Form.Item>
             <Form.Item hidden={true} name='dayOfWeek'>
                 <Input/>
             </Form.Item>
             <Form.Item hidden={true} name='workCalendarId'>
                 <Input/>
             </Form.Item>

             {!store.isEditItem &&
                 <Alert message={t('ChonDeSua')} type="info" showIcon />}


         </Form>
     </>
}

export default observer(DetailCalendarItemForm);
