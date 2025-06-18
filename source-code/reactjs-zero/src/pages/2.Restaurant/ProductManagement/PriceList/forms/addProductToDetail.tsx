import React, { EventHandler, useContext, useEffect, useRef, useState } from "react";
import {
	Button,
	Form,
	FormInstance,
	Input,
	Space,
	Table,
	TableColumnsType,
	TableProps,
	Tag,
} from "antd";
import TableUtil from "@ord-core/utils/table.util";
import { ProductUitCell } from "@pages/SalesInvoice/InvoiceReturn/datatable/productUnitCell";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import { RowSelectMethod, TableRowSelection } from "antd/es/table/interface";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";
import { ProductPriceListDetailDto } from "@api/index.defs";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { SummaryProductTable } from "@pages/ProductManagement/PriceList/table/SummaryProductTable";
import { useStore } from "@ord-store/index";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { set } from "lodash";

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
	key: string;
	name: string;
	age: string;
	address: string;
}

interface EditableRowProps {
	index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

interface EditableCellProps {
	title: React.ReactNode;
	editable: boolean;
	dataIndex: keyof Item;
	record: Item;
	selectedRowKeys: React.Key[];
	handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	selectedRowKeys,
	handleSave,
	...restProps
}) => {
	const form = useContext(EditableContext)!;

	useEffect(() => {
		if (record) form.setFieldValue(dataIndex, record[dataIndex]);
	}, [dataIndex, record]);

	const save = async () => {
		try {
			const values = await form.validateFields();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if (editable && !selectedRowKeys.includes(record.key)) {
		childNode = (
			<Space.Compact style={{ width: "100%" }}>
				<Button type={"dashed"}>
					<EditOutlined />
				</Button>
				<Form.Item style={{ margin: 0 }} name={dataIndex}>
					<PriceNumberInput
						className="text-right w-[150px]"
						controls={false}
						onPressEnter={save}
						onBlur={save}
					></PriceNumberInput>
				</Form.Item>
			</Space.Compact>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

type ColumnTypes = Exclude<
	TableProps<ProductPriceListDetailDto>["columns"],
	undefined
>;

export const AddProductToDetail = (props: {
	formAdd: FormInstance;
	saveHandler: EventHandler<any>;
	modalOpen?: Date;
}) => {
	const form = props.formAdd;
	const [formSearch] = Form.useForm();
	const { productPriceListDetailStore: mainStore } = useStore();
	const [reload, setReload] = useState<number>(0);
	const [dataSource, setDataSource] = useState<ProductPriceListDetailDto[]>([]);
	const [summaryPagination, setSummaryPagination] = useState({
		defaultCurrent: 1,
		defaultPageSize: 10,
		pageSize: 10,
		pageCurrent: 1,
		total: 0,
	});
	const { id } = useParams();

	const getProducts = () => {
		const skipCount =
			(summaryPagination.pageCurrent - 1) * summaryPagination.pageSize;
		ProductPriceListDetailService.getProductForAddPaged({
			body: {
				priceListPublishViewId: id,
				maxResultCount: summaryPagination.pageSize,
				skipCount: skipCount,
				...formSearch.getFieldsValue(),
			},
		}).then((rsp) => {
			if (rsp) {
				const newData = rsp.items?.map(
					(it: ProductPriceListDetailDto, index) => {
						return {
							...it,
							ordRowIndex: skipCount + index + 1,
							productPrice: it.productPrice || 0,
							key: `${it.productId}-${it.productUnitId}`,
						};
					}
				);
				// @ts-ignore
				setDataSource(newData);
				const pageInfo = {
					...summaryPagination,
					total: rsp.totalCount || 0,
				};
				// @ts-ignore
				setSummaryPagination(pageInfo);
			}
		});
	};

	useEffect(() => {
		getProducts();
	}, [reload]);

	useEffect(() => {
		getProducts();
		
		if (props.modalOpen) {
			setDataSource([]);
			setSelectedRowKeys([]);
			setSelectedItem([]);
			setSummaryPagination({
				defaultCurrent: 1,
				defaultPageSize: 10,
				pageSize: 10,
				pageCurrent: 1,
				total: 0,
			});
			form.resetFields();
			mainStore.insertItems = [];
		}
	}, [props.modalOpen]);

	useEffect(() => {
		form.setFieldValue("detail", JSON.stringify(dataSource));
	}, [dataSource]);

	const handleSave = (row: ProductPriceListDetailDto) => {
		const newData = [...dataSource];
		// @ts-ignore
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...row,
		});
		setDataSource(newData);
	};

	const components = {
		body: {
			row: EditableRow,
			cell: EditableCell,
		},
	};

	const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
	const [selectedItem, setSelectedItem] = useState<ProductPriceListDetailDto[]>(
		[]
	);
	const [isCheckedAll, setIsCheckAll] = useState<boolean>(false);
	const allRowKeys = useRef<React.Key[]>([]);
	const allRecords = useRef<ProductPriceListDetailDto[]>([]);

	const fetchAll = () => {
	};

	const onSelectChange = async (
		newSelectedRowKeys: React.Key[],
		records: any[],
		info: { type: RowSelectMethod }
	) => {
		if (info.type === 'all') {
			const newCheckedAll = !isCheckedAll;

			if (newCheckedAll) {
				if (allRecords.current.length === 0) {
					fetchAll();
				}
				setSelectedRowKeys(allRowKeys.current);
			} else {
				setSelectedRowKeys([]);
				setSelectedItem([]);
			}

			setIsCheckAll(newCheckedAll);
			return;
		}

		setIsCheckAll(false);

		const selectedIds = new Set(selectedItem.map((r) => r.publishViewId));
		const recordIds = new Set(
			dataSource.filter((item) => !records.some((r) => r.publishViewId === item.publishViewId))
				.map((x) => x.publishViewId)
		);

		const updatedSelectedRecords = [
			...selectedItem.filter((item) => !recordIds.has(item.publishViewId)),
			...records.filter((item) => !selectedIds.has(item.publishViewId))
		];

		setSelectedRowKeys(updatedSelectedRecords.map((x) => x.publishViewId) as any);
		setSelectedItem(updatedSelectedRecords);

		if (records.length === dataSource.length) {
			setIsCheckAll(true);
		}
	};

	const onChangePaginationSummary = (page: number, pageSize: number) => {
		const pageInfo = {
			...summaryPagination,
			pageCurrent: page,
			pageSize: pageSize,
		};
		setSummaryPagination(pageInfo);
		setReload(new Date().getTime());
	};

	const onRefreshDatasource = () => {
		setReload(new Date().getTime());
	};

	const columns: TableColumnsType<any> = TableUtil.getColumns(
		[
			{
				title: "product",
				dataIndex: "productName",
				align: "left",
				render: (value, record) => {
					return (
						<>
							<Tag color={"green"}>{record.productCode}</Tag> {value}
						</>
					);
				},
			},
			{
				dataIndex: "unitName",
				title: "unitName",
				align: "center",
				width: 120,
				render: (value, record) => {
					return <>{value}</>;
				},
			},
			{
				dataIndex: "costPrice",
				title: "costPrice",
				align: "end",
				render: (v) => <PriceCell value={v} />,
				width: 140,
			},
			{
				dataIndex: "generalPrice",
				title: "generalPrice",
				align: "end",
				render: (v) => <PriceCell value={v} />,
				width: 130,
			},
			{
				title: "priceList",
				dataIndex: "productPrice",
				align: "end",
				onCell: (record: any) => ({
					record,
					editable: true,
					dataIndex: "productPrice",
					title: "priceList",
					align: 'right',
					handleSave,
					selectedRowKeys,
				}),
			},
		],
		{ ns: "price-list-detail" }
	);

	return (
		<div>
			<Form className="flex w-full" form={formSearch} onFinish={getProducts}>
				<SearchFilterText span={24}></SearchFilterText>
			</Form>

			<Form hidden form={form} onFinish={props.saveHandler}>
				<Form.Item name="detail">
					<Input></Input>
				</Form.Item>
				<Form.Item name="idHash" initialValue={id}>
					<Input></Input>
				</Form.Item>
			</Form>

			<Table<ProductPriceListDetailDto>
				pagination={{ ...summaryPagination, position: ["none"] }}
				rowSelection={{
					selectedRowKeys,
					onChange: onSelectChange,
				}}
				components={components}
				rowClassName={() => "editable-row"}
				bordered
				dataSource={dataSource}
				columns={columns}
				summary={() => (
					<SummaryProductTable
						pagination={summaryPagination}
						summaryPagination={summaryPagination}
						onRefreshDatasource={onRefreshDatasource}
						onChangePaginationSummary={onChangePaginationSummary}
					/>
				)}
			/>
			<div className="mt-3">
				<Tag color={"gold"}>{selectedRowKeys.length} Sản phẩm đã được chọn</Tag>
			</div>
		</div>
	);
};
