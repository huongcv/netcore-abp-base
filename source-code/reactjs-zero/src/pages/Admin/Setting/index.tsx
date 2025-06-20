import React, {useEffect, useRef, useState} from "react";
import OrdCrudPage, {IActionBtn} from "@ord-components/crud/OrdCrudPage";
import {useStore} from "@ord-store/index";
import {Checkbox, Col, Form, Input, Space, TableColumnsType, Tooltip,} from "antd";
import {SettingDto} from "@api/index.defs";
import {useTranslation} from "react-i18next";
import ValidateUtils from "@ord-core/utils/validate.utils";
import TableUtil from "@ord-core/utils/table.util";
import {IsActivedColumn} from "@ord-components/table/columns/IsActivedColumn";
import {LWithNs} from "@ord-core/language/lang.utils";
import {CheckCircleOutlined, EyeInvisibleOutlined, EyeOutlined,} from "@ant-design/icons";
import {SearchFilterText} from "@ord-components/forms/search/SearchFilterText";
import {SearchIsActived} from "@ord-components/forms/search/SearchIsActived";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import TypeSettingSelectControl from "@pages/Admin/Setting/TypeSettingSelectControl";
import NameSettingSelectControl from "@pages/Admin/Setting/NameSettingSelectControl";
import FloatLabel from "@ord-components/forms/FloatLabel";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import UploadImgMulti from "@ord-components/common/uploadImgTemp/UploadImgMulti";
import {OrdImgCrop} from "@ord-components/forms/croping-img/OrdImgCrop";
import {AspectSizes} from "@ord-components/forms/croping-img/CropSize";

export const CreateOrUpdateForm = () => {
  const { t } = useTranslation("setting-list");
  const { t: tCommon } = useTranslation("common");
  const form = Form.useFormInstance();
  const oldValueRef = useRef<string | undefined>();
  const [formMode, setFomMode] = useState<
    "default" | "html" | "image" | "images"
  >("default");
  const [aspect, setAspect] = useState<number | undefined>(1);

  useEffect(() => {
    oldValueRef.current = form.getFieldValue("value");
  }, []);

  useEffect(() => {
    const name: string = form.getFieldValue("name");
    if (name?.includes(":HtmlTemplate")) {
      setFomMode("html");
    } else if (name?.includes(":Image:")) {
      setFomMode("image");
      chooseCropSize(name);
      form.setFieldValue("fileIdAssFromValue", oldValueRef.current);
    } else if (name?.includes(":Images:")) {
      setFomMode("images");
    } else {
      setFomMode("default");
    }
  }, [Form.useWatch("name", form)]);

  const chooseCropSize = (name: string) => {
    // đoạn này tạm thời dựa vào SETTING_NAME_FOR_APP để chia case tỉ lệ khung hình
    const arr = name.split(":");
    switch (arr[2]) {
      case "LogoFull":
        setAspect(undefined);
        break;
      case "LogoSimple":
        setAspect(undefined);
        break;
      case "FaviconIco":
        setAspect(AspectSizes.MotMot);
        break;
      case "BgLogin.Under":
        setAspect(AspectSizes.BgLoginUnder);
        break;
      case "BgLogin.Left":
        setAspect(AspectSizes.BgLoginLeft);
        break;
      case "DashboardSlider1":
        setAspect(AspectSizes.DashboardSlider);
        break;
      case "DashboardSlider2":
        setAspect(AspectSizes.DashboardSlider);
        break;
      case "DashboardSlider3":
        setAspect(AspectSizes.DashboardSlider);
        break;
      case "DashboardSlider4":
        setAspect(AspectSizes.DashboardSlider);
        break;
      case "DashboardSlider5":
        setAspect(AspectSizes.DashboardSlider);
        break;
      default:
        setAspect(AspectSizes.MotMot);
        break;
    }
  };
  const ContentForm = () => {
    switch (formMode) {
      case "html":
        return (
          <>
            <FloatLabel label={t("value")} required>
              <Form.Item
                hidden
                name="value"
                rules={[ValidateUtils.required]}
              ></Form.Item>
            </FloatLabel>
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: [
                  "undo",
                  "redo",
                  "|",
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "underline",
                  "link",
                  "bulletedList",
                  "numberedList",
                ],
              }}
              data={form.getFieldValue("value") ?? ""}
              onChange={(event, editor) => {
                const data = editor.getData();
                form.setFieldValue("value", data);
              }}
            />
          </>
        );
      case "image":
        // let aspect = 1;
        // if (form.getFieldValue('name') == 'Boostrap:Image:LogoFull') {
        //     aspect = 2.56;
        // }
        return (
          <>
            <FloatLabel label={t("value")} required>
              <Form.Item name="value" rules={[ValidateUtils.required]}>
                {/* <TempImgUpload
                                blobContainerPath='setting'></TempImgUpload> */}
                <OrdImgCrop useSaveCacheBefore={true} aspect={aspect} />
              </Form.Item>
            </FloatLabel>
            <Form.Item hidden name="fileIdAssFromValue"></Form.Item>
          </>
        );
      case "images":
        return (
          <>
            <Form.Item name="value">
              <UploadImgMulti
                isValueJson={true}
                blobContainerPath="setting"
              ></UploadImgMulti>
            </Form.Item>
          </>
        );
      default:
        return (
          <>
            <FloatLabel label={t("value")} required>
              <Form.Item name="value" rules={[ValidateUtils.required]}>
                <Input />
              </Form.Item>
            </FloatLabel>
            <Form.Item name="mustEncrypt" valuePropName="checked">
              <Checkbox>{t("mustEncrypt")}</Checkbox>
            </Form.Item>
          </>
        );
    }
  };
  return (
    <>
      <FloatLabel label={t("type")}>
        <Form.Item name="type" rules={[ValidateUtils.required]}>
          <TypeSettingSelectControl
            placeholder={tCommon("filterSelectCommonPlaceholder")}
          />
        </Form.Item>
      </FloatLabel>
      <FloatLabel label={t("name")} required>
        <Form.Item name="name" rules={[ValidateUtils.required]}>
          <NameSettingSelectControl typeSetting={Form.useWatch("type", form)} />
        </Form.Item>
      </FloatLabel>

      <ContentForm></ContentForm>

      <Form.Item name="isActived" valuePropName="checked">
        <Checkbox>{tCommon("dang_hoat_dong")}</Checkbox>
      </Form.Item>
    </>
  );
};
const NameSettingCell = (prop: { name?: string | null }) => {
  const [key, setKey] = useState<string>("");
  const tran = new LWithNs("setting-list");
  useEffect(() => {
    if (!prop.name) {
      setKey("");
      return;
    }
    setKey(prop.name.replace(/:/g, "."));
  }, [prop.name]);
  return <>{tran.l(key)}</>;
};
const ValueCell = (prop: { settingDto: SettingDto }) => {
  const [showValue, setShow] = useState<boolean>(false);
  return (
    <Space.Compact>
      {showValue ? (
        <Space>
          {" "}
          <Input value={prop.settingDto.value} disabled />{" "}
          <EyeInvisibleOutlined onClick={() => setShow(false)} />
        </Space>
      ) : (
        <Space>
          {" "}
          <Input type="password" value={prop.settingDto.value} disabled />{" "}
          <EyeOutlined onClick={() => setShow(true)} />
        </Space>
      )}
    </Space.Compact>
  );
};
const SearchForm = () => {
  const [t] = useTranslation("setting-list");
  const [tCommon] = useTranslation();
  return (
    <>
      <Col {...useResponsiveSpan(6)}>
        <FloatLabel label={t("type")}>
          <Form.Item name="type">
            <TypeSettingSelectControl
              allowClear={true}
              placeholder={tCommon("filterSelectCommonPlaceholder")}
            />
          </Form.Item>
        </FloatLabel>
      </Col>
      <SearchIsActived />
      <SearchFilterText />
    </>
  );
};

const Setting: React.FC = () => {
  const { settingStore: mainStore } = useStore();
  const columns: TableColumnsType<SettingDto> = TableUtil.getColumns(
    [
      {
        title: "type",
        dataIndex: "type",
        width: 200,
        render: (v) => mainStore.tran.l("settingType." + v),
        sorter: true,
      },
      {
        dataIndex: "name",
        render: (v: string) => <NameSettingCell name={v} />,
        title: "name",
      },
      {
        dataIndex: "value",
        render: (v: string, record: SettingDto) => {
          return <ValueCell settingDto={record} />;
        },
        title: "value",
      },
      {
        dataIndex: "mustEncrypt",
        render: (v: boolean, record: SettingDto) => {
          return (
            <>
              <Tooltip placement="topLeft" title={record.rawValue}>
                {v && <CheckCircleOutlined className="text-xl text-blue-600" />}
              </Tooltip>
            </>
          );
        },
        width: 150,
        align: "center",
        title: "mustEncrypt",
      },
      IsActivedColumn(),
    ],
    {
      actions: [
        {
          title: "view",
          onClick: (d: SettingDto) => {
            d.value = d.rawValue;
            mainStore.openViewDetailModal(d);
          },
        },
        {
          title: "edit",
          onClick: (d: SettingDto) => {
            d.value = d.rawValue;
            mainStore.openUpdateModal(d);
          },
        },
        // {
        //     title: 'remove',
        //     onClick: (d) => {
        //         mainStore.openRemoveById(d);
        //     }
        // }
      ],
      ns: mainStore.getNamespaceLocale(),
    }
  );
  const topActions: IActionBtn[] = [
    {
      title: "addNew",
      permission: "AuthPlugin.Setting.SetValue",
      onClick: () => {
        mainStore.openCreateModal();
      },
    },
  ];
  return (
    <>
      <OrdCrudPage
        stored={mainStore}
        topActions={topActions}
        columns={columns}
        searchForm={() => <SearchForm />}
        entityForm={(form) => <CreateOrUpdateForm />}
      ></OrdCrudPage>
    </>
  );
};
export default Setting;
