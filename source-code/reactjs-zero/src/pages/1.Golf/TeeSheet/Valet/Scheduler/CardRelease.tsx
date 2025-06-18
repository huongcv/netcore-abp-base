import { AccessCardDto, ReleaseCardHistoryOutput } from "@api/index.defs";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { useStore } from "@ord-store/index";
import { Col, Form, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { Trans, useTranslation } from "react-i18next";
import TableUtil from "@ord-core/utils/table.util";
import DateUtil from "@ord-core/utils/date.util";
import { ITableAction } from "@ord-components/table/cells/TableActionCell";
import { RollbackOutlined } from "@ant-design/icons";
import UiUtils from "@ord-core/utils/ui.utils";
import { AccessCardService } from "@api/AccessCardService";
import { AccessCardStatusEnum } from "../../Booking/Scheduler/ExtFunction";
import { ValetService } from "@api/ValetService";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import { debounce } from "lodash";

const CardRelease = () => {
  const { golfBookingStore: mainStore } = useStore();
  const { t } = useTranslation(mainStore.getNamespaceLocale());
  const { t:tAc } = useTranslation("golf_access_card");
  const [searchFormRef] = Form.useForm();
  const { t: tEnum } = useTranslation("enum");

  const columns: TableColumnsType<ReleaseCardHistoryOutput> =
    TableUtil.getColumns(
      [
        {
          title: "UID",
          dataIndex: "uid",
          width: 140,
        },
        {
          title: "partnerName",
          dataIndex: "partnerName",
          width: 200,
        },
        {
          title: "startDate",
          dataIndex: "startDate",
          width: 200,
          render: (_) => (
            <>{_ ? DateUtil.toFormat(_, "DD/MM/YYYY HH:mm") : "-"}</>
          ),
        },
        {
          title: tAc("accessStatus"),
          width: 140,
          render: (_: any, record: ReleaseCardHistoryOutput) => <>{tEnum(record.strAccessStatus || "")}</>,
        },
      ],

      {
        actions: [
          {
            title: "recoverCard",
            icon: <RollbackOutlined />,
            onClick: (d) => {
              handleRecallCard(d);
            },
            hiddenIf: (d: AccessCardDto) => {
              return d.accessStatus !== AccessCardStatusEnum.Assigned;
            },
          },
        ] as ITableAction<ReleaseCardHistoryOutput>[],
        ns: "golf_access_card",
      }
    );

  const handleRecallCard = (d: ReleaseCardHistoryOutput) => {
    UiUtils.showConfirm({
      title: tAc("confirmRecallTitle"),
      content: (
        <Trans
          ns={"golf_access_card"}
          i18nKey="confirmRecall"
          values={{
            code: d.uid,
          }}
          components={{ italic: <i />, bold: <strong /> }}
        />
      ),
      onOk: async () => {
        UiUtils.setBusy();
        try {
          if (d.accessCardId === "" || d.accessCardId == undefined) return;

          const update = await AccessCardService.revokeCardByAccessCardId({
            body: {
              accessCardId: d.accessCardId,
              note: "Thu hồi thẻ ",
            },
          });

          if (update.isSuccessful) {
            UiUtils.showSuccess(tAc(`recallSuccess`));
            mainStore.refreshGridData(true);
          } else {
            UiUtils.showError(tAc(`recallFaild`));
          }
        } catch (err: any) {
          UiUtils.showError(tAc(`updateIsActiveFaildErr500`) + err?.Message);
        } finally {
          UiUtils.clearBusy();
        }
      },
      onCancel: () => {},
      isDanger: true,
    });
  };

  const onResetClick = () => {
    searchFormRef.resetFields();
    mainStore.refreshGridData(true).then();
  };

  return (
    <>
      <Form
        form={searchFormRef}
        onFinish={debounce((d) => {
          mainStore.searchData(d);
        }, 250)}
      >
        <SearchFilterText span={24} onReset={onResetClick} ignoreAutoFocus/>
      </Form>
      <AntTableWithDataPaged
        searchForm={searchFormRef}
        getPageResult={(d) => {
          return ValetService.getReleaseCardHistory(
            {
              body: {
                ...d.body,
                // courseId: w_courseId,
                // playDate: w_playDate,
              },
            },
            {}
          );
        }}
        columns={columns}
        searchData={mainStore.searchDataState}
        refreshDatasource={mainStore.refreshDataState}
      />
    </>
  );
};
export default observer(CardRelease);
