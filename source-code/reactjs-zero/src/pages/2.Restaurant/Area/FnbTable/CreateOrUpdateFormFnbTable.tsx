import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelecFnbArea } from "@ord-components/forms/select/selectDataSource/useSelectFnbArea";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import regexUtil from "@ord-core/utils/regex.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, InputNumber, Row } from "antd";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const CreateOrUpdateFormFnbTable = () => {
	const { t } = useTranslation('fnb-table');
	const { t: tCommon } = useTranslation("common");

	const focusRef = useAutoFocus();
	const { fnbTableStore: mainStore } = useStore();

	return (
		<>
			<Row gutter={16}>
				<Col span={18}>
					<FloatLabel
						label={t("code")}
						required={mainStore.createOrUpdateModal.mode === "update"}
					>
						<Form.Item
							name="code"
							rules={
								mainStore.createOrUpdateModal.mode === "update"
									? [ValidateUtils.required]
									: []
							}
						>
							<OrdInputRegexText maxLength={50} regex={regexUtil.CodeRegex} />
						</Form.Item>
					</FloatLabel>
				</Col>
				<Col span={6}>
					<Form.Item
						noStyle
						name="isActived"
						valuePropName="checked"
						initialValue={true}
					>
						<Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
					</Form.Item>
				</Col>
				<Col span={24}>
					<FloatLabel label={t("name")} required>
						<Form.Item name="name" rules={[ValidateUtils.required, ValidateUtils.maxLength(200)]}>
							<Input ref={focusRef} />
						</Form.Item>
					</FloatLabel>
				</Col>
				<Col lg={24}>
					<FloatLabel label={t("numberOfSeat")}>
						<Form.Item name="numberOfSeat">
							<InputNumber style={{ width: '100%' }} />
						</Form.Item>
					</FloatLabel>
				</Col>
				<Col lg={24}>
					<FloatLabel label={t("area")} required>
						<Form.Item name="areaId" rules={[ValidateUtils.required,]}>
							<OrdSelect datasource={useSelecFnbArea()} />
						</Form.Item>
					</FloatLabel>
				</Col>
			</Row>
			<Form.Item hidden noStyle name="id">
				<Input hidden />
			</Form.Item>
		</>
	);
};
export default CreateOrUpdateFormFnbTable;
