import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdDateInput from "@ord-components/forms/OrdDateInput";
import OrdRadio from "@ord-components/forms/select/OrdRadio";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import {useSelectDistrict} from "@ord-components/forms/select/selectDataSource/useSelectDistrict";
import {useSelectGender} from "@ord-components/forms/select/selectDataSource/useSelectGender";
import {useSelectPartnerGroup} from "@ord-components/forms/select/selectDataSource/useSelectPartnerGroup";
import {useSelectProvince} from "@ord-components/forms/select/selectDataSource/useSelectProvince";
import {useSelectWard} from "@ord-components/forms/select/selectDataSource/useSelectWard";
import dateUtil from "@ord-core/utils/date.util";
import validateUtils from "@ord-core/utils/validate.utils";
import {useStore} from "@ord-store/index";
import {Col, Form, Input, InputNumber, Row} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useCallback, useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useSelectCustomPartnerType} from "./useSelectCustomPartnerType";
import CitizenIdentityInput from "@ord-components/forms/DeserializeCard/CitizenIdentityInput";
import {PartnerSettingWrapperProps, withPartnerSetting} from "@pages/Customer/withPartnerSetting";
import {IFormSettingShop_General} from "@pages/System/ShopSetting/setting-name.const";

interface IPartnerCustomerEntityProps extends PartnerSettingWrapperProps {
    requiredPhone?: boolean
}

const PartnerCustomerEntity = (prams: IPartnerCustomerEntityProps) => {
    const {requiredPhone = false, setting = {}} = prams;
    const {
        isSingleCustomerGroup: isSingleGroup = false,
        isCustomerCodePrefixByGroup: isCodePrefixByGroup = false
    } = setting as IFormSettingShop_General;
    const {t} = useTranslation("customer");
    const form = Form.useFormInstance();
    const categoryId_w = Form.useWatch("categoryId", form);
    const cityCode_w = Form.useWatch("cityCode", form);
    const prefixCode_w = Form.useWatch("prefixCode", form);
    const groupIdHelper_w = Form.useWatch("groupIdHelper", form)

    const id_w = Form.useWatch("id", form);
    const {sessionStore} = useStore();

    const dataPartnerGroupCustomer = useSelectPartnerGroup(1);
    useEffect(() => {
        if (categoryId_w === 2) {
            form.setFieldsValue({
                dateOfBirth: null,
                monthOfDate: null,
                monthAge: null,
                age: null,
                weight: null,
                height: null
            });
        }
    }, [categoryId_w, form]);
    // useEffect(() => {
    //     if (groupIdHelper_w && dataPartnerGroupCustomer?.data?.length > 0) {
    //
    //     }
    // }, [groupIdHelper_w, dataPartnerGroupCustomer?.data])
    useEffect(() => {
        if (id_w && id_w > 0 && isSingleGroup) {
            const currentGroupIds = form.getFieldValue("groupIds") as number[] | undefined;
            if (Array.isArray(currentGroupIds) && currentGroupIds.length > 0) {
                form.setFieldValue("groupIdHelper", currentGroupIds[0]);
            }
        }
    }, [id_w, isSingleGroup])

    // useEffect(() => {
    //     if (id_w && id_w > 0 && isSingleGroup) {
    //
    //     }
    // }, [id_w, isSingleGroup])

    const getCodeGroup = (groupId: string): string => {
        if (groupId) {
            const get = dataPartnerGroupCustomer.data.find(gc => gc.value == groupId)
            if (get && get.data) {
                return get.data.groupCode
            }
        }
        return ""
    }


    const onChangeMonthAge = (monthsAge: number | null) => {
        if (monthsAge != null) {
            form.setFieldsValue({dateOfBirth: null});

            if (monthsAge && monthsAge > 0) {

                const today = new Date();
                const birthDateBase = new Date(today.getFullYear(), today.getMonth(), 1);

                const birthDate = new Date(birthDateBase);
                birthDate.setMonth(birthDate.getMonth() - monthsAge);

                return {
                    age: null,
                    monthsAge,
                    yearOfBirth: birthDate.getFullYear(),
                    monthOfBirth: birthDate.getMonth() + 1,
                    dateOfBirth: null,
                };
            }
        }
        return {}
    }

    const onChangeAge = (age: number | null) => {
        if (age && age > 0) {
            const today = dateUtil.getNow();

            return {
                age,
                monthAge: null,
                yearOfBirth: today.getFullYear() - age,
                monthOfBirth: null,
                dayOfBirth: null,
            };
        }
        return {};
    }

    const onChangeYearOfBirth = (yearOfBirth: number | null) => {
        if (!yearOfBirth) return {};
        return useCalculateAge(
            yearOfBirth
        );
    }

    const onChangeDateOfBirth = (dateOfBirth?: Date | null) => {
        if (!dateOfBirth || isNaN(dateOfBirth.getTime())) return {};
        return useCalculateAge(
            dateOfBirth.getFullYear(),
            dateOfBirth.getMonth() + 1,
            dateOfBirth.getDate()
        );
    };

    const onChangeState = (val: any) => {
        form.setFieldValue('districtCode', null);
        form.setFieldValue('wardCode', null);
    }

    const onChangeDistrict = (val: any) => {
        form.setFieldValue('wardCode', null);
    }

    const onChangeWard = (_: any, val: any) => {
        if (val) {
            const data = JSON.parse(JSON.stringify(val.data ?? {}))
            form.setFieldValue('address', data?.areaFullName);
        }
    }

    const useCalculateAge = useCallback(
        (yearOfBirth?: number, monthOfBirth?: number, dayOfBirth?: number) => {
            if (yearOfBirth == null) {
                return {
                    age: null,
                    monthsAge: null,
                    yearOfBirth,
                    monthOfBirth,
                    dayOfBirth,
                    dateOfBirth: null,
                };
            }

            monthOfBirth = monthOfBirth ?? 1;
            dayOfBirth = dayOfBirth ?? 1;

            let dateOfBirth;
            try {
                dateOfBirth = new Date(yearOfBirth, monthOfBirth - 1, dayOfBirth);
                if (isNaN(dateOfBirth.getTime()) || dateOfBirth.getFullYear() !== yearOfBirth) {
                    return {};
                }
            } catch {
                return {};
            }

            const today = new Date();
            let totalMonthsOld =
                (today.getFullYear() - dateOfBirth.getFullYear()) * 12 +
                (today.getMonth() - dateOfBirth.getMonth());

            if (today.getDate() < dateOfBirth.getDate()) {
                totalMonthsOld -= 1;
            }

            if (totalMonthsOld <= 72) {
                return {
                    age: 0,
                    monthsAge: totalMonthsOld === 0 ? 1 : totalMonthsOld,
                    yearOfBirth,
                    monthOfBirth,
                    dayOfBirth,
                    dateOfBirth,
                };
            }

            let age = today.getFullYear() - dateOfBirth.getFullYear();
            if (
                today.getMonth() < dateOfBirth.getMonth() ||
                (today.getMonth() === dateOfBirth.getMonth() &&
                    today.getDate() < dateOfBirth.getDate())
            ) {
                age -= 1;
            }

            return {
                age,
                monthsAge: null,
                yearOfBirth,
                monthOfBirth,
                dayOfBirth,
                dateOfBirth,
            };
        },
        [form]
    );

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <FloatLabel label={t("category")}>
                        <Form.Item name='categoryId' initialValue={1} required rules={[validateUtils.required]}>
                            <OrdRadio datasource={useSelectCustomPartnerType()}/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>

                <Col span={6}>
                    {isSingleGroup && <FloatLabel label={t("groupId")} required={isCodePrefixByGroup}>
                        <Form.Item name="groupIdHelper"
                                   rules={isSingleGroup && isCodePrefixByGroup ? [validateUtils.required] : []}>
                            <OrdSelect
                                onChange={(value)=>{
                                    form.setFieldValue("groupIds", value ? [value] : []);
                                    if (isCodePrefixByGroup) {
                                        const codeGroup = getCodeGroup(value);
                                        form.setFieldValue("prefixCode", codeGroup)
                                    }
                                }}
                                datasource={dataPartnerGroupCustomer}
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>}
                    {!isSingleGroup && <FloatLabel label={t("groupId")}>
                        <Form.Item name="groupIds">
                            <OrdSelect
                                datasource={dataPartnerGroupCustomer}
                                mode='multiple'
                            ></OrdSelect>
                        </Form.Item>
                    </FloatLabel>}

                    <Form.Item hidden noStyle name="groupIds"></Form.Item>
                    <Form.Item hidden noStyle name="prefixCode"></Form.Item>
                </Col>


                <Col span={6}>
                    <FloatLabel
                        label={t("code")}
                        required={id_w}
                    >
                        <Form.Item
                            name="code"
                            rules={
                                id_w
                                    ? [validateUtils.required, validateUtils.NoSpecialCharacter]
                                    : [validateUtils.NoSpecialCharacter]
                            }
                        >
                            <Input
                                addonBefore={isSingleGroup && isCodePrefixByGroup && !id_w ? prefixCode_w : undefined}
                                maxLength={20} className="uppercase"/>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("name")} required>
                        <Form.Item
                            name="name"
                            rules={[
                                validateUtils.required,
                                // validateUtils.mustBeSmallerThan(100),
                            ]}
                        >
                            <CitizenIdentityInput
                                onFetchCitizenDone={(data) => {
                                    form.setFieldsValue({
                                        gender: data.gender,
                                        dateOfBirth: data.dateOfBirth,
                                        address: data.permanentAddress,
                                        code: data.nationalId,
                                        cityCode: data.cityCode,
                                        districtCode: data.districtCode,
                                        wardCode: data.wardCode,
                                    })
                                }}
                                autoFocus></CitizenIdentityInput>
                            {/*<Input maxLength={100} autoFocus/>*/}
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={6}>
                    <FloatLabel label={t("phone")} required={requiredPhone}>
                        <Form.Item
                            name="phone"
                            rules={requiredPhone ? [validateUtils.required, validateUtils.phoneNumberVietNam] : [validateUtils.phoneNumberVietNam]}
                        >
                            <Input maxLength={14} required/>
                        </Form.Item>
                    </FloatLabel>
                </Col>


                <Col span={6}>
                    <FloatLabel label={t('dateOfBirth')}>
                        <Form.Item
                            name='dateOfBirth'>
                            <OrdDateInput
                                disabled={categoryId_w == 2}
                                disabledDate={dateUtil.disableAfterNow}
                                onChange={(data) => {
                                    if (data) {
                                        const obj = onChangeDateOfBirth(data) as any;
                                        form.setFieldValue('age', obj.age);
                                        form.setFieldValue('monthOfBirth', obj.monthOfBirth);
                                        form.setFieldValue('monthAge', obj.monthsAge);
                                        form.setFieldValue('yearOfBirth', obj.yearOfBirth);
                                    }
                                }}></OrdDateInput>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={6}>
                    <FloatLabel label={t("taxCode")}>
                        <Form.Item name="taxCode" rules={[validateUtils.taxCode]}>
                            <Input disabled={categoryId_w == 1}></Input>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={6}>
                    <FloatLabel label={t("gender")}>
                        <Form.Item name="gender" initialValue={1}>
                            <OrdRadio
                                datasource={useSelectGender()}
                                disabled={categoryId_w === 2}
                            ></OrdRadio>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                {sessionStore.isPharmacy &&
                    <>
                        <Col span={3}>
                            <FloatLabel label={t('yearOfBirth')}>
                                <Form.Item
                                    name='yearOfBirth'>
                                    <InputNumber className={"w-full"}
                                                 disabled={categoryId_w == 2}
                                                 onChange={(data) => {
                                                     const obj = onChangeYearOfBirth(data) as any;

                                                     form.setFieldValue('age', obj.age);
                                                     form.setFieldValue('monthOfBirth', obj.monthOfBirth);
                                                     form.setFieldValue('monthAge', obj.monthsAge);
                                                     form.setFieldValue('dateOfBirth', null);
                                                 }}
                                                 max={2200}
                                                 min={1900}></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={3}>
                            <FloatLabel label={t('age')}>
                                <Form.Item
                                    name='age'>
                                    <InputNumber className={"w-full"}
                                                 disabled={categoryId_w == 2}
                                                 onChange={(data) => {
                                                     const obj = onChangeAge(data) as any;

                                                     form.setFieldValue('monthOfBirth', obj.monthOfBirth);
                                                     form.setFieldValue('monthAge', obj.monthsAge);
                                                     form.setFieldValue('yearOfBirth', obj.yearOfBirth);
                                                     form.setFieldValue('dateOfBirth', null)
                                                 }}
                                                 max={125}
                                                 min={0}></InputNumber>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={4}>
                            <FloatLabel label={t("monthOfBirth")}>
                                <Form.Item name="monthAge">
                                    <InputNumber className={"w-full"}
                                                 disabled={categoryId_w == 2}
                                                 onChange={(data) => {
                                                     const obj = onChangeMonthAge(data);

                                                     form.setFieldValue('age', obj.age);
                                                     form.setFieldValue('monthOfBirth', obj.monthOfBirth);
                                                     form.setFieldValue('yearOfBirth', obj.yearOfBirth);
                                                     form.setFieldValue('dateOfBirth', null)
                                                 }}
                                                 max={72}
                                                 min={0}></InputNumber>
                                </Form.Item>
                                <Form.Item hidden name="monthOfBirth"/>
                            </FloatLabel>
                        </Col>
                        <Col span={4}>
                            <FloatLabel label={t("weight")}>
                                <Form.Item name="weight">
                                    <InputNumber disabled={categoryId_w == 2} className={"w-full"} min={0}
                                                 maxLength={5}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                        <Col span={4}>
                            <FloatLabel label={t("height")}>
                                <Form.Item name="height">
                                    <InputNumber disabled={categoryId_w == 2} className={"w-full"} min={0}
                                                 maxLength={5}/>
                                </Form.Item>
                            </FloatLabel>
                        </Col>
                    </>
                }
            </Row>


            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <FloatLabel label={t("cityCode")}>
                        <Form.Item name="cityCode">
                            <OrdSelect datasource={useSelectProvince()} onChange={onChangeState}></OrdSelect>
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={6}>
                    <FloatLabel label={t("districtCode")}>
                        <Form.Item name="districtCode">
                            <OrdSelect
                                datasource={useSelectDistrict(
                                    Form.useWatch("cityCode", form)
                                )}
                                onChange={onChangeDistrict}
                                allowClear
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
                <Col span={12}>
                    <FloatLabel label={t("wardCode")}>
                        <Form.Item name="wardCode">
                            <OrdSelect
                                datasource={useSelectWard(
                                    Form.useWatch("districtCode", form)
                                )}
                                onChange={onChangeWard}
                                allowClear
                            />
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <FloatLabel label={t("address")}>
                        <Form.Item
                            name="address"
                            rules={[validateUtils.mustBeSmallerThan(200)]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <FloatLabel label={t("notes")}>
                        <Form.Item
                            name="notes"
                            rules={[validateUtils.mustBeSmallerThan(200)]}
                        >
                            <TextArea rows={3}></TextArea>
                        </Form.Item>
                    </FloatLabel>
                </Col>
            </Row>

            <Form.Item hidden name="id"/>
            <Form.Item hidden name="isActived" initialValue={true}/>
            <Form.Item hidden name="loyaltyTierId"/>
            <Form.Item hidden name="loyaltyPoint"/>
            <Form.Item hidden name="totalAmount"/>
        </>
    );
}

export const PartnerCustomerEntityForm = withPartnerSetting<IPartnerCustomerEntityProps>(PartnerCustomerEntity);
