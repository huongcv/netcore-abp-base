import React, {useEffect, useMemo, useRef, useState} from "react";
import {Card, Col, Form, Input, Row, Table, TableColumnsType} from "antd";
import ValidateUtils from "@ord-core/utils/validate.utils";
import {useStore} from "@ord-store/index";
import {useTranslation} from "react-i18next";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {PARTNER_PER} from "@ord-core/config/permissions/partner.permission";
import FormList from "antd/es/form/FormList";
import {GolfBookingPLayerDto, PartnerSyncDto, TeeTimeAvailabilityDto} from "@api/index.defs";
import PartnerInput from "@pages/AccountantManagement/Shared/forms/PartnerInput";
import {debounce, flatten} from "lodash";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import dayjs from "dayjs";
import {formatTime} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import OrdSelect, {IOrdSelectOption} from "@ord-components/forms/select/OrdSelect";
import {useRentalBuggyType} from "@ord-components/forms/select/selectDataSource/golf/useRentalBuggyType";
import {RentalBuggyTypeEnum} from "@pages/1.Golf/TeeSheet/Booking/enum/paymentModeEnum";
import {DecimalNumberInput} from "@ord-components/forms/DecimalNumberInput";
import GolfPlayerPartnerInput from "@pages/1.Golf/shared/components/GolfPlayerPartnerInput";
import {useSelectCaddy} from "@ord-components/forms/select/selectDataSource/useSelectCaddy";

dayjs.extend(isSameOrAfter);

interface IGolfBookingPLayerDto extends GolfBookingPLayerDto {
    rowKey: string;
}

interface ITeeTimePlayerNo {
    playerNo: number;
    teeTime: string;
}

GroupPlayerInfo.propTypes = {};
export const fieldListPlayer = "listPlayer";

function GroupPlayerInfo(props: { dataSourceTeeTime: SelectDataSource }) {
    const {golfBookingStore: mainStore, sessionStore} = useStore();
    const {t} = useTranslation(mainStore.getNamespaceLocale());
    const {t: tEnum} = useTranslation("enum");
    const form = Form.useFormInstance();
    const srcRentalBuggyType = useRentalBuggyType();
    const isShowDropdownPartner = checkPermissionUser(
        sessionStore.appSession,
        PARTNER_PER.viewCustomerList
    );
    const srcCaddy = useSelectCaddy()

    const removeRowRef = useRef<(index: number) => void | undefined>();
    const addRowRef =
        useRef<
            (defaultValue?: unknown, insertIndex?: number) => void | undefined
        >();
    const fieldsRef = useRef<unknown[]>([]);

    const handleRemoveRow = (index: number) => {
        if (removeRowRef.current) {
            removeRowRef.current(index);
        }
    };
    const w_TotalPlayers = Form.useWatch("totalPlayers", form);
    const w_TeeTime = Form.useWatch("teeTime", form);

    const [teePlayerNo, setTeePlayerNo] = useState<ITeeTimePlayerNo[]>([]);
    useEffect(() => {
        if (!w_TeeTime || !props.dataSourceTeeTime?.data?.length) return;
        const currentTime = dayjs(w_TeeTime, "HH:mm:ss");
        const lstAfter = props.dataSourceTeeTime.data
            .filter((f) => {
                const fTime = dayjs(f.value as string, "HH:mm:ss");
                const isAvailable = (f.data as TeeTimeAvailabilityDto)?.isAvailable;
                return f.value && fTime.isSameOrAfter(currentTime) && isAvailable;
            })
            .map((f) => {
                const rawSlots =
                    (f.data as TeeTimeAvailabilityDto)?.listAvailableSlots ?? "";
                const teeTime = (f.data as TeeTimeAvailabilityDto)?.startTime;
                return rawSlots.split(",").map(
                    (no) =>
                        ({
                            playerNo: parseInt(no),
                            teeTime,
                        } as ITeeTimePlayerNo)
                );
            });
        setTeePlayerNo(flatten(lstAfter));
    }, [w_TeeTime, props.dataSourceTeeTime]);

    useEffect(() => {
        console.log("teePlayerNo", [...teePlayerNo]);
        debouncedEffectTotalPlayer(w_TotalPlayers, teePlayerNo);
        return () => debouncedEffectTotalPlayer.cancel();
    }, [w_TotalPlayers, teePlayerNo]);
    const debouncedEffectTotalPlayer = useMemo(() => {
        return debounce((value: number, teePlNo: ITeeTimePlayerNo[]) => {
            const currentList = fieldsRef.current;
            const currentCount = currentList?.length || 0;
            const diff = (value || 0) - currentCount;
            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    const item = teePlNo[currentCount + i];
                    if (item) {
                        addRowRef.current?.({
                            rowKey: `temp_${Date.now()}_${i}`,
                            teeTime: item.teeTime,
                            playerNo: item.playerNo,
                            isDefaultPlayer: currentCount == 0,
                        });
                    }
                }
            } else if (diff < 0) {
                for (let i = 0; i < Math.abs(diff); i++) {
                    const indexToRemove = fieldsRef.current.length - 1 - i;
                    removeRowRef.current?.(indexToRemove);
                }
            } else {
                // trường hợp update
                const newList = currentList.map((field, index) => {
                    const slot = teePlNo[index];
                    if (!slot) return form.getFieldValue([fieldListPlayer, index]); // fallback

                    let oldData = form.getFieldValue([fieldListPlayer, index]);
                    const isChanged =
                        oldData.teeTime !== slot.teeTime ||
                        oldData.playerNo !== slot.playerNo;

                    if (!isChanged) return oldData;

                    return {
                        ...oldData,
                        teeTime: slot.teeTime,
                        playerNo: slot.playerNo,
                        isDefaultPlayer: index === 0,
                    };
                });
                form.setFieldsValue({
                    [fieldListPlayer]: newList,
                });
            }
        }, 300);
    }, []);
    const listPlayer = Form.useWatch(fieldListPlayer, form) || [];

    const columns: TableColumnsType<GolfBookingPLayerDto> = [
        {
            title: t('teeTime'),
            dataIndex: "teeTime",
            width: 120,
            render: (teeTime: string, _, index) => (
                <>
                    <Form.Item name={[index, "order"]} noStyle hidden initialValue={index}>
                    </Form.Item>
                    <Form.Item name={[index, "teeTime"]} noStyle>
                        <span>{formatTime(teeTime)}</span>
                    </Form.Item>
                </>
            ),
        },
        {
            title: t('partnerName'),
            width: 250,
            dataIndex: "partnerId",
            render: (_, __, index) => (
                <Form.Item
                    name={[index, "partnerId"]}
                    rules={[ValidateUtils.required]}
                    style={{marginBottom: 0}}
                >
                    <GolfPlayerPartnerInput
                        partner_type={1}
                        placeholder={(index == 0 ? "* " : "") + t("codeOrPhone")}
                        requiredPhone={index === 0}
                        onChange={(val, op) => {
                            form.setFieldValue([fieldListPlayer, index, "phone"], op?.phone);
                        }}
                    />
                </Form.Item>
            ),
        },
        {
            title: t("phone"),
            dataIndex: "phone",
            render: (_, __, index) => (
                <Form.Item
                    name={[index, "phone"]}
                    style={{marginBottom: 0}}>
                    <Input disabled placeholder={(index == 0 ? "* " : "") + t("phone")}/>
                </Form.Item>
            ),
        },
        {
            title: t("bookingCaddyCode"),
            dataIndex: "bookingCaddyCode",
            width: 150,
            render: (_, __, index) => (
                <>
                    <Form.Item
                        name={[index, "bookingCaddyId"]}
                        style={{marginBottom: 0}}
                    >
                        <OrdSelect datasource={srcCaddy}
                                   onChange={(value, option: IOrdSelectOption) => {
                                       console.log("ChangeValue")
                                       if (option && option.data) {
                                           form.setFieldValue([fieldListPlayer, index, "bookingCaddyCode"], option?.data.code);
                                       }
                                   }}
                        ></OrdSelect>
                    </Form.Item>
                    <Form.Item noStyle hidden name={[index, "bookingCaddyCode"]}/>
                </>
            ),
        },
        {
            title: t("caddyAssignedCode"),
            dataIndex: "caddyAssignedCode",
            width: 150,
            render: (_, __, index) => (
                <>
                    <Form.Item
                        name={[index, "caddyAssignedId"]}
                        style={{marginBottom: 0}}
                    >
                        <OrdSelect datasource={srcCaddy}
                                   onChange={(value, option: IOrdSelectOption) => {
                                       if (option && option.data) {
                                           form.setFieldValue([fieldListPlayer, index, "caddyAssignedCode"], option?.data.code);
                                       }
                                   }}
                        ></OrdSelect>
                    </Form.Item>
                    <Form.Item noStyle hidden name={[index, "caddyAssignedCode"]}/>
                </>
            ),
        },
        {
            title: t("rentalBuggyType"),
            dataIndex: "rentalBuggyType",
            width: 150,
            align: 'center',
            render: (_, __, index) => (
                <Form.Item
                    name={[index, "rentalBuggyType"]}
                    style={{marginBottom: 0}}
                    initialValue={RentalBuggyTypeEnum.RentAll}
                >
                    <OrdSelect
                        allowClear={false}
                        datasource={srcRentalBuggyType}
                    ></OrdSelect>
                </Form.Item>
            ),
        },
    ];

    return (
        <Card
            title={<strong>{t("groupInfo")}</strong>}
            styles={{
                header: {
                    borderBottom: "none",
                    marginTop: "10px",
                },
            }}
        >
            <Row gutter={[16, 8]}>
                <Col span={24}>
                    <FormList name={fieldListPlayer}>
                        {(fields, {add, remove}) => {
                            addRowRef.current = add;
                            removeRowRef.current = remove;
                            fieldsRef.current = fields;

                            const data = fields.map((field, index) => ({
                                ...form.getFieldValue([fieldListPlayer, index]),
                                key: field.key,
                            }));

                            return (
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    rowKey="key"
                                    pagination={false}
                                    bordered
                                />
                            );
                        }}
                    </FormList>
                </Col>
            </Row>
        </Card>
    );
}

export default GroupPlayerInfo;
