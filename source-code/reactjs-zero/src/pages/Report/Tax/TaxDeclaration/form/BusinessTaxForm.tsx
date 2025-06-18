import { ArrowLeftOutlined } from "@ant-design/icons";
import { TaxDeclrationService } from "@api/TaxDeclrationService";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectDistrict } from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import { useSelectProvince } from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import { useSelectWard } from "@ord-components/forms/select/selectDataSource/useSelectWard";
import uiUtils from "@ord-core/utils/ui.utils";
import { Select, Form, Button, Space, Row, Col, Radio, Input, Checkbox, InputNumber, TimePicker, DatePicker } from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EnvironmentTaxTable from "./EnvironmentTaxTable";
import TaxTable from "./TaxTable";
import TtdbTable from "./TtdbTable";
import dayjs, {Dayjs} from "dayjs";

const { Option } = Select;


const BussinessTaxForm = () => {
    const [form] = Form.useForm();

    const navigate = useNavigate();
    let { id } = useParams();

    useEffect(() => {
        TaxDeclrationService.getById({
            findId: Number(id)
        }).then(res => {
            if (res) {
                const formValues: any = { ...res };
            
                const openStr = String(res.openHours || '');
                if (openStr.includes(':')) {
                    const [h, m, s] = openStr.split(':');
                    formValues.openHours = dayjs(`1970-01-01T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`);
                }
            
                const closeStr = String(res.closeHours || '');
                if (closeStr.includes(':')) {
                    const [h, m, s] = closeStr.split(':');
                    formValues.closeHours = dayjs(`1970-01-01T${h.padStart(2, '0')}:${m.padStart(2, '0')}:${s.padStart(2, '0')}`);
                }
            
                form.setFieldsValue(formValues);
            }
        })
    }, []);

    const handleOk = async () => {
        const data = await form.validateFields();
        uiUtils.setBusy();
        TaxDeclrationService.createOrUpdate({
            body: {
                ...data,
                openHours: data.openHours?.format("HH:mm:ss"),
                closeHours: data.closeHours?.format("HH:mm:ss"),
                id,
            }
        }).then(res => {
            uiUtils.clearBusy();
            if (res.isSuccessful) {
                navigate("/app/shop/report/tax/tax-declaration");
            }
        }).finally(() => {
            uiUtils.clearBusy();
        })
    };

    const topAction: IActionBtn[] = [
        {
            content: (
                <>
                    <Button onClick={() => navigate(-1)}>
                        <Space>
                            <ArrowLeftOutlined />
                        </Space>
                        Quay lại (F10)
                    </Button>
                </>
            ),
        },
        {
            content: (
                <>
                    <Button type='primary' onClick={() => handleOk()}>
                        <Space>
                        </Space>
                        Lưu (F8)
                    </Button>
                </>
            ),
        },
    ];
    

    return (
        <>
            <PageTopTitleAndAction usingCustom={true}
                items={['Báo cáo thuế', 'Chi tiết tờ khai']}>
                <TopAction topActions={topAction} />
            </PageTopTitleAndAction>
            <div style={{ marginBottom: 13 }} />
            <div style={{ backgroundColor: '#ffffff', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center'  }}>
                <h2 style={{ textAlign: 'center', marginBottom: 32, fontWeight: '700', color: '#333' }}>TỜ KHAI THUẾ ĐỐI VỚI HỘ KINH DOANH, CÁ NHÂN KINH DOANH</h2>
                <Form form={form} layout="vertical" style={{ width: 1400, maxWidth: "100%" }}>
                    <Row gutter={[16, 16]}>
                        <Col span={24}>
                            <Form.Item name="declarationType">
                                <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <Radio value={100}>HKD, CNKD nộp thuế theo phương pháp khoán</Radio>
                                    <Radio value={200}>CNKD nộp thuế theo từng lần phát sinh</Radio>
                                    <Radio value={300}>Tổ chức, cá nhân khai thuế thay, nộp thuế thay</Radio>
                                    <Radio value={400}>HKD, CNKD nộp thuế phương pháp kê khai</Radio>
                                    <Radio value={500}>HKD, CNKD trong lĩnh vực ngành nghề có căn cứ xác định doanh thu theo xác nhận của cơ quan chức năng</Radio>
                                    <Radio value={600}>Hộ khoán chuyển đổi phương pháp tính thuế</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[05] Tên cửa hàng/thương hiệu">
                                <Form.Item name="shopName">
                                    <Input placeholder="Nhập tên cửa hàng hoặc thương hiệu" autoFocus />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[06] Tài khoản ngân hàng">
                                <Form.Item name="bankAccountCode">
                                    <Input placeholder="Nhập số tài khoản ngân hàng" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[07] Mã số thuế">
                                <Form.Item name="taxCode">
                                    <Input placeholder="Nhập mã số thuế" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[08] Ngành nghề kinh doanh">
                                <Form.Item name="taxPayerName">
                                    <Input />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <Form.Item name="isChangeInformation" valuePropName="checked">
                                <Checkbox>[08a] Thay đổi thông tin</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <FloatLabel label="[09] Diện tích kinh doanh (m²)">
                                <Form.Item name="area">
                                    <Input />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="isRentArea" valuePropName="checked">
                                <Checkbox>[09a] Đi thuê</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[10] Số lượng lao động sử dụng thường xuyên">
                                <Form.Item name="numberOfEmployee">
                                    <InputNumber min={0} style={{ width: '100%' }} />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[11] Thời gian hoạt động trong ngày">
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Form.Item name="openHours">
                                            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Giờ mở cửa" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="closeHours">
                                            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Giờ đóng cửa" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </FloatLabel>
                        </Col>

                        <Col span={12}>
                            <span>[12] Địa chỉ kinh doanh</span>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="isChangeAddress" valuePropName="checked">
                                <Checkbox>[12a] Thay đổi thông tin</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <FloatLabel label="[12.đ] Tỉnh/Thành phố">
                                <Form.Item name="cityCode">
                                    <OrdSelect datasource={useSelectProvince()}></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[12.d] Quận/Huyện/Thị xã/TP thuộc tỉnh">
                                <Form.Item name="districtCode">
                                    <OrdSelect datasource={useSelectDistrict(Form.useWatch("cityCode", form))} allowClear />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[12.c] Phường/Xã/Thị trấn">
                                <Form.Item name="wardCode">
                                    <OrdSelect datasource={useSelectWard(Form.useWatch("districtCode", form))} allowClear />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[12.b] Số nhà, đường/phố/xóm/ấp/thôn">
                                <Form.Item name="street">
                                    <Input placeholder="Nhập số nhà, đường/phố/xóm/ấp/thôn" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={12}>
                            <Form.Item name="isBorderMarket" valuePropName="checked">
                                <Checkbox>[12e] Kinh doanh tại chợ biên giới</Checkbox>
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <span>[13] Địa chỉ thường trú</span>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[13.d] Tỉnh/Thành phố">
                                <Form.Item name="residentialCityCode">
                                    <OrdSelect datasource={useSelectProvince()}></OrdSelect>
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[13.c] Quận/Huyện/Thị xã/TP thuộc tỉnh">
                                <Form.Item name="residentialDistrictCode">
                                    <OrdSelect datasource={useSelectDistrict(Form.useWatch("residentialCityCode", form))} allowClear />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[13.b] Phường/Xã/Thị trấn">
                                <Form.Item name="residentialWardCode">
                                    <OrdSelect datasource={useSelectWard(Form.useWatch("residentialDistrictCode", form))} allowClear />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[13.a] Số nhà, đường/phố/xóm/ấp/thôn">
                                <Form.Item name="residentialAddress">
                                    <Input placeholder="Nhập số nhà, đường/phố/xóm/ấp/thôn" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[14] Điện thoại">
                                <Form.Item name="phone">
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[15] Fax">
                                <Form.Item name="fax">
                                    <Input placeholder="Nhập số fax" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[16] Email">
                                <Form.Item name="email">
                                    <Input placeholder="Nhập email" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={12}>
                            <FloatLabel label="[17] Văn bản uỷ quyền khai thuế (nếu có)">
                                <Form.Item name="authorizationDocumentNumber">
                                    <Input placeholder="Nhập số văn bản uỷ quyền" />
                                </Form.Item>
                            </FloatLabel>

                        </Col>
                        <Col span={12}>
                            <FloatLabel label="Ngày">
                                <Form.Item name="authorizationDocumentDate">
                                    <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày" />
                                </Form.Item>
                            </FloatLabel></Col>

                        <Col span={24}>
                            <FloatLabel label="[19] Tên đại lý thuế (nếu có)">
                                <Form.Item name="agentName">
                                    <Input placeholder="Nhập tên đại lý thuế" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[20] Mã số thuế đại lý">
                                <Form.Item name="agentTaxCode">
                                    <Input placeholder="Nhập mã số thuế đại lý" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={12}>
                            <FloatLabel label="[21] Hợp đồng đại lý thuế: Số">
                                <Form.Item name="agentContractNumber">
                                    <Input placeholder="Nhập số hợp đồng" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={12}>
                            <FloatLabel label="Ngày">
                                <Form.Item name="agentContractDate">
                                    <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày hợp đồng" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[22] Tên của tổ chức khai thay (nếu có)">
                                <Form.Item name="representativeOrganizationName">
                                    <Input placeholder="Nhập tên tổ chức" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[23] Mã số thuế">
                                <Form.Item name="representativeOrganizationTaxCode">
                                    <Input placeholder="Nhập mã số thuế" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[24] Địa chỉ">
                                <Form.Item name="representativeOrganizationAddress">
                                    <Input placeholder="Nhập địa chỉ" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[25] Điện thoại">
                                <Form.Item name="representativeOrganizationPhone">
                                    <Input placeholder="Nhập số điện thoại" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[26] Fax">
                                <Form.Item name="representativeOrganizationFax">
                                    <Input placeholder="Nhập số fax" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <FloatLabel label="[27] Email">
                                <Form.Item name="representativeOrganizationEmail">
                                    <Input placeholder="Nhập email" />
                                </Form.Item>
                            </FloatLabel>
                        </Col>

                        <Col span={24}>
                            <h2 style={{margin: '8px 0'}}>A. KÊ KHAI GIÁ TRỊ GIA TĂNG (GTGT), THUẾ THU NHẬP CÁ NHÂN (TNCN)</h2>
                            <TaxTable />
                        </Col>

                        <Col span={24}>
                        <h2 style={{margin: '8px 0'}}>B.KÊ KHAI THUẾ TIÊU THỤ ĐẶC BIỆT</h2>
                            <TtdbTable />
                        </Col>

                        <Col span={24}>
                        <h2 style={{margin: '8px 0'}}>C.KÊ KHAI THUẾ/PHÍ BẢO VỆ MÔI TRƯỜNG HOẶC THUẾ TÀI NGUYÊN</h2>
                            <EnvironmentTaxTable />
                        </Col>
                    </Row>

                    <div hidden>
                        <Form.Item name='periodType' />
                        <Form.Item name='periodYear' />
                        <Form.Item name='periodQuarter' />
                        <Form.Item name='periodMonth' />
                        <Form.Item name='periodYear' />
                        <Form.Item name='periodDate' />
                        <Form.Item name='isFirstTimeReport' />
                        <Form.Item name="periodMonthFrom" />
                        <Form.Item name="periodMonthTo" />
                        <Form.Item name="declarationTemplate" />
                        <Form.Item name="id" />
                    </div>
                </Form>
            </div>


        </>
    );
};

export default BussinessTaxForm;