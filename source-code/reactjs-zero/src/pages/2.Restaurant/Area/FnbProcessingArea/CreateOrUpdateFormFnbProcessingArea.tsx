import FloatLabel from "@ord-components/forms/FloatLabel";
import OrdInputRegexText from "@ord-components/forms/OrdInputRegexText";
import OrdSelect from "@ord-components/forms/select/OrdSelect";
import { useSelecFnbArea } from "@ord-components/forms/select/selectDataSource/useSelectFnbArea";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import regexUtil from "@ord-core/utils/regex.util";
import ValidateUtils from "@ord-core/utils/validate.utils";
import { useStore } from "@ord-store/index";
import { Checkbox, Col, Form, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTranslation } from "react-i18next";

const CreateOrUpdateFormFnbProcessingArea = () => {
	const { t } = useTranslation('fnb-processing-area');
	const { t: tCommon } = useTranslation("common");

	const focusRef = useAutoFocus();
	const { fnbProcessingAreaStore: mainStore } = useStore();

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
						<Form.Item name="name" rules={[ValidateUtils.required]}>
							<Input maxLength={200} ref={focusRef}/>
						</Form.Item>
					</FloatLabel>
				</Col>
				<Col span={24}>
					<FloatLabel label={t("description")}>
						<Form.Item name="description" rules={[ValidateUtils.maxLength(200)]}>
						<Input.TextArea rows={2}></Input.TextArea>
						</Form.Item>
					</FloatLabel>
				</Col>
				<Form.Item hidden noStyle name="id">
					<Input hidden />
				</Form.Item>
			</Row>
		</>
	);
};
export default CreateOrUpdateFormFnbProcessingArea;
