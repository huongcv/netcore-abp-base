// Updated React component with tab layout for salary and insurance
import { PayCircleOutlined } from "@ant-design/icons";
import { EmployeePayrollService } from "@api/EmployeePayrollService";
import {
	EmployeePayrollDetailDto,
	EmployeePayrollDto,
	InsuranceDetailDto,
} from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateTimeInput from "@ord-components/forms/OrdDateTimeInput";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelectPaymentMethod } from "@ord-components/forms/select/selectDataSource/useSelectPaymentMethod";
import uiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import { useStore } from "@ord-store/index";
import {
	Col,
	Form,
	Input,
	Modal,
	Row,
	Table,
	Tabs,
	TableColumnsType,
	Tooltip,
} from "antd";
import dayjs from "dayjs";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const { TabPane } = Tabs;
const { TextArea } = Input;

const formatInsuranceType = (type: number) => {
	switch (type) {
		case 1521:
			return "Nộp BHXH";
		case 1522:
			return "Nộp BHYT";
		case 1523:
			return "Nộp BHTN";
	}
};

const PayEmployeePayrollModal = () => {
	const [form] = Form.useForm();
	const { payrollStore: stored } = useStore();
	const { t } = useTranslation("payroll");

	const [selectedRowKeysSalary, setSelectedRowKeysSalary] = useState<React.Key[]>([]);
	const [selectedRowKeysInsurance, setSelectedRowKeysInsurance] = useState<React.Key[]>([]);
	const [salaryData, setSalaryData] = useState<EmployeePayrollDetailDto[]>([]);
	const [insuranceData, setInsuranceData] = useState<InsuranceDetailDto[]>([]);

	useEffect(() => {
		const data = stored.entityUpdateData as EmployeePayrollDto;
		form.setFieldsValue(data);

		const fetchData = async () => {
			uiUtils.setBusy();
			try {
				const [salaryRes, insuranceRes] = await Promise.all([
					EmployeePayrollService.getListSalaryDetailForPayment({
						payrollId: Number(data.id),
					}),
					EmployeePayrollService.getListInsuranceDetailForPayment({
						payrollId: Number(data.id),
					}),
				]);

				uiUtils.clearBusy();

				setSalaryData(
					salaryRes.map((item) => ({
						...item,
						payingAmount: (item.totalSalaryAmount ?? 0) - (item.paymentTotalSalary ?? 0),
					}))
				);

				setInsuranceData(
					insuranceRes.map((item) => ({
						...item,
						payingAmount: (item.totalAmount ?? 0) - (item.paymentAmount ?? 0),
					}))
				);

				setSelectedRowKeysSalary(
					salaryRes
						.filter(item => (item.totalSalaryAmount ?? 0) - (item.paymentTotalSalary ?? 0) > 0)
						.map(x => Number(x.id))
				);
				setSelectedRowKeysInsurance(
					insuranceRes
						.filter(item => (item.totalAmount ?? 0) - (item.paymentAmount ?? 0) > 0)
						.map(x => Number(x.type))
				);
			} catch (err) {
				uiUtils.clearBusy();
				console.error("Load error:", err);
			}
		};

		fetchData();
	}, []);

	const salaryColumns: TableColumnsType<EmployeePayrollDetailDto> = [
		{ title: "STT", render: (_, __, i) => i + 1, width: 60, align: "center" },
		{ title: "Họ và tên", dataIndex: "employeeName" },
		{ title: "Tổng lương", dataIndex: "totalSalaryAmount", align: "right", render: (v) => utils.formatterNumber(v) },
		{ title: "Đã trả", dataIndex: "paymentTotalSalary", align: "right", render: (v) => utils.formatterNumber(v) },
		{
			title: "Thanh toán", align: "right", dataIndex: "payingAmount",
			render: (_, record, index) => {
				const max = (record.totalSalaryAmount ?? 0) - (record.paymentTotalSalary ?? 0);
				return (
					<Tooltip title={!selectedRowKeysSalary.includes(Number(record.id)) ? "Chọn để nhập số tiền" : ""}>
						<PriceNumberInput
							className="text-right not-handler-wrap w-full"
							value={record.payingAmount}
							min={0}
							max={max}
							disabled={!selectedRowKeysSalary.includes(Number(record.id)) || max <= 0}
							onChange={(val) => {
								const parsed = val === null
									? undefined
									: typeof val === 'string'
										? Number(val.replace(/,/g, ''))
										: val;

								const updated = [...salaryData];
								updated[index].payingAmount = isNaN(parsed as number) ? undefined : parsed;
								setSalaryData(updated);
							}}
						/>
					</Tooltip>
				);
			}
		},
		{
			title: "Ghi chú", dataIndex: "notes", render: (_, record, index) => {
				const max = (record.totalSalaryAmount ?? 0) - (record.paymentTotalSalary ?? 0);
				const isDisabled = !selectedRowKeysSalary.includes(Number(record.id)) || max <= 0;

				return (
					<TextArea
						value={record.notes}
						rows={1}
						disabled={isDisabled}
						onChange={(e) => {
							const updated = [...salaryData];
							updated[index].notes = e.target.value;
							setSalaryData(updated);
						}}
					/>
				);
			}
		}
	];

	const insuranceColumns: TableColumnsType<InsuranceDetailDto> = [
		{ title: "STT", render: (_, __, i) => i + 1, width: 60, align: "center" },
		{ title: "Loại bảo hiểm", dataIndex: "type", render: formatInsuranceType },
		{ title: "Tổng tiền", dataIndex: "totalAmount", align: "right", render: (v) => utils.formatterNumber(v) },
		{ title: "Đã trả", dataIndex: "paymentAmount", align: "right", render: (v) => utils.formatterNumber(v) },
		{
			title: "Thanh toán", dataIndex: "payingAmount", align: "right",
			render: (_, record, index) => {
				const max = (record.totalAmount ?? 0) - (record.paymentAmount ?? 0);
				return (
					<PriceNumberInput
						className="text-right not-handler-wrap w-full"
						value={record.payingAmount}
						min={0}
						disabled={!selectedRowKeysInsurance.includes(Number(record.type))}
						onChange={(val) => {
							debugger;
							const parsed = val === null
								? undefined
								: typeof val === 'string'
									? Number(val.replace(/,/g, ''))
									: val;

							const updated = [...insuranceData];
							updated[index].payingAmount = isNaN(parsed as number) ? undefined : parsed;
							setInsuranceData(updated);
						}}
					/>
				);
			}
		},
		{
			title: "Cơ quan nhận",
			dataIndex: "receiver",
			render: (_, record, index) => {
				const max = (record.totalAmount ?? 0) - (record.paymentAmount ?? 0);
				const isDisabled = !selectedRowKeysInsurance.includes(Number(record.type)) || max <= 0;

				return (
					<Input
						value={record.partnerName}
						disabled={isDisabled}
						onChange={(e) => {
							const updated = [...insuranceData];
							updated[index].partnerName = e.target.value;
							setInsuranceData(updated);
						}}
					/>
				);
			}
		},
		{
			title: "Ghi chú", dataIndex: "notes", render: (_, record, index) => {
				const max = (record.totalAmount ?? 0) - (record.paymentAmount ?? 0);
				const isDisabled = !selectedRowKeysInsurance.includes(Number(record.type)) || max <= 0;

				return (
					<TextArea
						rows={1}
						value={record.notes}
						disabled={isDisabled}
						onChange={(e) => {
							const updated = [...insuranceData];
							updated[index].notes = e.target.value;
							setInsuranceData(updated);
						}}
					/>
				);
			}
		}
	];

	const totalSalary = salaryData.filter(x => selectedRowKeysSalary.includes(Number(x.id))).reduce((a, b) => a + (b.payingAmount ?? 0), 0);
	const totalInsurance = insuranceData.filter(x => selectedRowKeysInsurance.includes(Number(x.type))).reduce((a, b) => a + (b.payingAmount ?? 0), 0);

	const onOkModal = async () => {
		const values = await form.validateFields();
		uiUtils.setBusy();
		await EmployeePayrollService.payEmployeePayroll({
			body: {
				payRollId: (stored.entityUpdateData as EmployeePayrollDto).id,
				moveDate: values.moveDate,
				paymentMethod: values.paymentMethod,
				lstPaySalaryEmployeeDetail: salaryData.filter(x => selectedRowKeysSalary.includes(Number(x.id))).map(x => ({ detailId: x.id, payingAmount: x.payingAmount ?? 0, notes: x.notes })),
				lstInsuranceDetail: insuranceData.filter(x => selectedRowKeysInsurance.includes(Number(x.type))).map(x => ({ type: x.type, payingAmount: x.payingAmount ?? 0, partnerName: x.partnerName, notes: x.notes }))
			}
		}).then(res => {
			uiUtils.clearBusy();
			res.isSuccessful ? uiUtils.showSuccess("Thanh toán thành công") : uiUtils.showError("Thanh toán thất bại")
			stored.closeEmployeePayrollModal();
		}).catch(e => {
			uiUtils.clearBusy();
			console.error(e);
		});
	};

	return (
		<Modal
			width={'80%'}
			style={{ top: 10 }}
			open={stored.isOpenEmployeePayrollModal}
			title="THANH TOÁN BẢNG LƯƠNG"
			onCancel={() => stored.closeEmployeePayrollModal()}
			destroyOnClose
			footer={
				<FooterCrudModal
					okBtn={<><PayCircleOutlined /> <span className="ml-1">{t("Thanh toán")}</span></>}
					onOk={onOkModal}
					onCancel={() => stored.closeEmployeePayrollModal()}
				/>
			}
		>
			<Form form={form} layout="vertical">
				<Row gutter={16}>
					<Col span={10}><FloatLabel label={t("name.payroll")}><Form.Item name='name'><Input disabled /></Form.Item></FloatLabel></Col>
					<Col span={6}><FloatLabel label={t("paymentDate")}><Form.Item name='moveDate'><OrdDateTimeInput format={{ format: 'DD/MM/YYYY HH:mm', type: 'mask' }} disabledDate={(cur) => cur && cur.isAfter(dayjs(), 'day')} /></Form.Item></FloatLabel></Col>
					<Col span={8}><FloatLabel label={t("paymentMethod")}><Form.Item name='paymentMethod'><OrdSelect datasource={useSelectPaymentMethod()} /></Form.Item></FloatLabel></Col>
				</Row>
			</Form>
			<Tabs defaultActiveKey="salary" style={{ marginTop: 8 }}>
				<TabPane tab="1. Lương nhân viên" key="salary">
					<Table
						dataSource={salaryData}
						rowKey="id"
						columns={salaryColumns}
						rowSelection={{
							selectedRowKeys: selectedRowKeysSalary,
							onChange: setSelectedRowKeysSalary,
							getCheckboxProps: (record) => {
								const total = record.totalSalaryAmount ?? 0;
								const paid = record.paymentTotalSalary ?? 0;
								const remain = total - paid;
								return {
									disabled: remain <= 0
								};
							}
						}}
						pagination={false}
						scroll={{ y: 240 }}
						bordered
					/>
					<div style={{ textAlign: "right", fontWeight: "bold", marginTop: 8 }}>Tổng thanh toán lương: {utils.formatterNumber(totalSalary)} đ</div>
				</TabPane>
				<TabPane tab="2. Thanh toán bảo hiểm" key="insurance">
					<Table
						dataSource={insuranceData}
						rowKey="type"
						columns={insuranceColumns}
						rowSelection={{
							selectedRowKeys: selectedRowKeysInsurance,
							onChange: setSelectedRowKeysInsurance,
							getCheckboxProps: (record) => {
								const total = record.totalAmount ?? 0;
								const paid = record.paymentAmount ?? 0;
								const remain = total - paid;
								return {
									disabled: remain <= 0,
								};
							}
						}}
						pagination={false}
						scroll={{ y: 240 }}
						bordered
					/>
					<div style={{ textAlign: "right", fontWeight: "bold", marginTop: 8 }}>Tổng thanh toán bảo hiểm: {utils.formatterNumber(totalInsurance)} đ</div>
				</TabPane>
			</Tabs>

			<div style={{ textAlign: 'right', fontWeight: 'bold', color: '#096dd9', paddingTop: 8, borderTop: '1px solid #f0f0f0', marginTop: 12 }}>
				Tổng cộng: {utils.formatterNumber(totalSalary + totalInsurance)} đ
			</div>
		</Modal>
	);
};

export default observer(PayEmployeePayrollModal);
