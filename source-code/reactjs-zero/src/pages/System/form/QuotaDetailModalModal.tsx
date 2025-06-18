import { EinvoiceService } from "@api/EinvoiceService";
import ModalCloseBtn from "@ord-components/btn-action/ModalCloseBtn";
import FloatLabel from "@ord-components/forms/FloatLabel";
import { PriceNumberInput } from "@ord-components/forms/PriceNumberInput";
import tableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import utils from "@ord-core/utils/utils";
import { Button, Checkbox, Col, Input, Modal, Row, Space, Table, Typography } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SETTING_NAME_FOR_SHOP } from "../ShopSetting/setting-name.const";
import { ShopSettingService } from "@api/ShopSettingService";
import { boolean } from "@api/index.defs";

const { Title } = Typography;

interface QuotaDetailModalProps {
    open: boolean;
    onClose: (res?: any) => void;
    autoDelete: boolean;
}

const extractDay = (name: string): string => {
    const match = name.match(/Range(\d{4})(\d{2})(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : "";
};

export default function QuotaDetailModal({ open, onClose, autoDelete }: QuotaDetailModalProps) {
    const formatterNumber = utils.formatterNumber;
    const [tableData, setTableData] = useState<any[]>([]);
    const [monthlyRate, setMonthlyRate] = useState<number>(0);
    const [lastCalculatedMonthlyRate, setLastCalculatedMonthlyRate] = useState<number>(0);
    const [isModified, setIsModified] = useState(false);
    const [autoDeleteEinvoice, setAutoDeleteEinvoice] = useState<boolean>(autoDelete);

    useEffect(() => {
        if (!open) return;

        uiUtils.setBusy();

        Promise.all([
            ShopSettingService.getValue({
                name: SETTING_NAME_FOR_SHOP.invoice.monthlyRate,
            }),
            ShopSettingService.getMontlyRatePlan(),
        ])
            .then(([rateRes, planRes]) => {
                // Handle monthly rate
                const rate = +(rateRes?.value ?? 0);
                setMonthlyRate(rate);
                setLastCalculatedMonthlyRate(rate);

                // Handle plan table
                const mapped = planRes
                    .map((item, index) => ({
                        ...item,
                        key: index,
                        day: extractDay(item.name ?? ""),
                        value: parseFloat(item.value ?? "") || 0,
                    }))
                    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

                setTableData(mapped);
            })
            .finally(() => {
                uiUtils.clearBusy();
            });
    }, [open]);

    const handleValueChange = useCallback((val: number, index: number) => {
        const newData = [...tableData];
        newData[index] = { ...newData[index], value: val };
        setTableData(newData);
    }, [tableData]);

    const handleSave = useCallback(() => {

        if (isModified) {
            uiUtils.showWarning("Vui lòng tính toán lại trước khi lưu");
            return;
        }

        const result = tableData.map(({ name, value }) => ({
            name,
            value: value.toString(),
        }));

        const totalQuota = tableData.reduce((sum, x) => sum + (x.value || 0), 0);
        if (totalQuota > monthlyRate) {
            uiUtils.showError("Tổng tiền chi tiết lớn hơn mức ban đầu");
            return;
        }

        result.push({
            name: SETTING_NAME_FOR_SHOP.invoice.monthlyRate,
            value: totalQuota.toString(),
        });

        uiUtils.setBusy();
        ShopSettingService.setListValue({
            body: result
        }).then(res => {
            uiUtils.showInfo("Cập nhật chi tiết thành công");
            onClose({
                monthlyRate: totalQuota,
                autoDeleted: autoDelete
            });
        }).finally(() => {
            uiUtils.clearBusy()
        })
    }, [tableData, isModified, autoDelete, monthlyRate]);

    const calculatePlan = useCallback(() => {
        uiUtils.setBusy()
        EinvoiceService.calculateQuotaStrategyPreview({ newMonthlyQuota: monthlyRate })
            .then(res => {
                uiUtils.clearBusy()
                const mapped = res
                    .map((item: any, index: number) => ({
                        ...item,
                        key: index,
                        day: extractDay(item.name),
                        value: parseFloat(item.value) || 0,
                    }))
                    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

                setTableData(mapped);
                setLastCalculatedMonthlyRate(monthlyRate);
                setIsModified(false);
            }).finally(() => {
                uiUtils.clearBusy()
            });
    }, [monthlyRate]);

    const columns = useMemo(() => tableUtil.getColumns([
        {
            title: "Ngày",
            dataIndex: "day",
            key: "day",
            align: "center",
            width: 100,
        },
        {
            title: "Tổng",
            dataIndex: "value",
            key: "value",
            align: "center",
            width: 300,
            render: (val: number, _record: any, index: number) => (
                <PriceNumberInput
                    value={val}
                    onChange={val => handleValueChange(+(val ?? 0), index)}
                    style={{ textAlign: 'right' }}
                />
            ),
        },
    ], {}, true), [formatterNumber, handleValueChange]);

    const total = useMemo(() =>
        formatterNumber(tableData.reduce((sum, x) => sum + (x.value || 0), 0)),
        [tableData, formatterNumber]
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={"Chi tiết"}
            width={700}
            footer={
                <Space wrap>
                    <ModalCloseBtn onClick={onClose} />
                    <Button type="primary" onClick={handleSave}>Lưu</Button>
                </Space>
            }
        >
            <Row gutter={[8, 0]} style={{ marginBottom: 12 }}>
                <Col flex="1 1 auto">
                    <FloatLabel label="Tổng">
                        <PriceNumberInput
                            onChange={(val) => {
                                const value = +(val ?? 0);
                                setIsModified(value !== lastCalculatedMonthlyRate);
                                setMonthlyRate(value);
                            }}
                            value={monthlyRate}
                        />
                    </FloatLabel>
                </Col>
                <Col flex="0 0 120px">
                    <Button
                        block
                        disabled={!monthlyRate}
                        type="primary"
                        onClick={calculatePlan}
                    >
                        Tính toán
                    </Button>
                </Col>
                <Col span={24}>
                    <Checkbox
                        checked={autoDeleteEinvoice}
                        onChange={(e) => setAutoDeleteEinvoice(e.target.checked)}
                    >
                        Chỉ xuất hoá đơn trong ngày
                    </Checkbox>
                </Col>
            </Row>

            {tableData.length > 0 &&
                <>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        bordered
                        scroll={{ y: 400 }}
                    />
                    <div style={{
                        marginTop: 8,
                        paddingTop: 8,
                        borderTop: '1px solid #f0f0f0',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        color: '#096dd9'
                    }}>
                        Tổng cộng: {utils.formatterNumber(total)}
                    </div>
                </>}
        </Modal>
    );
}
