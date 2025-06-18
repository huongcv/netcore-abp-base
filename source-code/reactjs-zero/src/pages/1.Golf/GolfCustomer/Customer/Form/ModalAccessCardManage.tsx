import { PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import { GolfCustomerService } from "@api/GolfCustomerService";
import { PartnerAccessCardDto } from "@api/index.defs";
import { FooterCrudModal } from "@ord-components/crud/FooterCrudModal";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { TopAction } from "@ord-components/crud/TopAction";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import dateUtil from "@ord-core/utils/date.util";
import tableUtil from "@ord-core/utils/table.util";
import uiUtils from "@ord-core/utils/ui.utils";
import CustomerStore from "@ord-store/Golf/Customer/customerStateStore";
import { Button, Modal, Space, Spin, TableColumnsType } from "antd";
import { observer } from "mobx-react-lite";
import { lazy, Suspense, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

export const ModalAccessCardManage = (prop: { stored: CustomerStore }) => {
  const { t } = useTranslation(["golf-customer"]);
  const { accessCardManageModel } = prop.stored;
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  useEffect(() => {
    if (accessCardManageModel.entityData?.id) {
    }
  }, [accessCardManageModel.visible]);

  const topActions: IActionBtn[] = [
    {
      content: (
        <>
          <Button
            type="primary"
            onClick={() => {
              prop.stored.setOpenAddMemberShipCardModal();
            }}
          >
            <Space>
              <PlusOutlined />
            </Space>
            {t("assignAccessCardMember")}
          </Button>
        </>
      ),
    },
  ];

  const LazyModalMemberShipCard = lazy(
    () => import("../Form/ModalMemberShipCard")
  );

  return (
    <>
      {accessCardManageModel.visible && (
        <Modal
          title={t("title.quanLyTheThanhVien") as any}
          open={accessCardManageModel.visible}
          width={accessCardManageModel.width || 550}
          maskClosable={false}
          style={{ top: "30px" }}
          onCancel={() => prop.stored.closeAccessCardManageModal()}
          destroyOnClose
          footer={
            <FooterCrudModal
              hiddenOk={true}
              onOk={() => {}}
              onCancel={() => prop.stored.closeAccessCardManageModal()}
            />
          }
        >
          <Spin spinning={isSpinning}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingBottom: 5,
              }}
            >
              <TopAction topActions={topActions} />
            </div>
            <PartnerAccessCardTable
              partnerId={accessCardManageModel.entityData?.id}
              stored={prop.stored}
            />
          </Spin>
        </Modal>
      )}
      <Suspense fallback={<Spin />}>
        {prop.stored.updateMemberShipCardModel.visible && (
          <LazyModalMemberShipCard
            stored={prop.stored}
            partnerId={accessCardManageModel.entityData?.id}
          ></LazyModalMemberShipCard>
        )}
      </Suspense>
    </>
  );
};
export default observer(ModalAccessCardManage);

export const PartnerAccessCardTable = observer(
  (prop: {
    partnerId: any;
    stored: CustomerStore;
    isView?: boolean;
    isNoAction?: boolean;
  }) => {
    const { t } = useTranslation(["golf-customer"]);
    const { t: tEnum } = useTranslation("enum");
    const columns: TableColumnsType<PartnerAccessCardDto> =
      tableUtil.getColumns(
        [
          {
            title: "uid",
            dataIndex: "uid",
            width: 200,
          },
          {
            title: "accessCardColor",
            dataIndex: "cardColorName",
            width: 140,
                render: (text: string | null | undefined) => {
                    if (!text) {
                        return '-';
                    }

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: text,
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    );
                }
          },
          // {
          //     title: "cardType",
          //     width: 140,
          //     render: (_: any, record: PartnerAccessCardDto) => (
          //         <>
          //             {tEnum(record.strCardType || "")}
          //         </>
          //     ),
          // },
          {
            title: "startDate",
            width: 140,
            render: (_: any, record: PartnerAccessCardDto) => (
              <>{dateUtil.toFormat(record.startDate, "DD/MM/YYYY HH:mm")}</>
            ),
          },
          {
            title: "endDate",
            width: 140,
            render: (_: any, record: PartnerAccessCardDto) => (
              <>
                {record.endDate &&
                  dateUtil.toFormat(record.endDate, "DD/MM/YYYY HH:mm")}
              </>
            ),
          },
          // {
          //     title: "accessStatus",
          //     width: 150,
          //     render: (_: any, record: PartnerAccessCardDto) => (
          //         <>
          //             {tEnum(record.strAccessStatus || "")}
          //         </>
          //     ),
          // },
        ],
        prop.isNoAction
          ? { ns: prop.stored.getNamespaceLocale(), widthRowIndexCol: 30 }
          : {
              actions: [
                // {
                //     // tạm ko cho edit
                //     title: "edit",
                //     hiddenIf: () => !!prop.isView,
                //     onClick: (d: PartnerAccessCardDto) => {
                //         prop.stored.setOpenUpdateMemberShipCardModal(d);
                //     },
                // },
                {
                    title: "revokerPartnerAccessCard",
                    icon: <RollbackOutlined />,
                    onClick: (d) => {
                        uiUtils.showConfirm({
                            title: t('ConfirmRevokerPartnerAccessCard'),
                            content: (<Trans ns="golf-customer"
                                             i18nKey="ConfirmRevokeAccessCard"
                                             values={d}
                                             components={{ italic: <i />, bold: <strong /> }}></Trans>),
                            onOk: () => {
                                uiUtils.setBusy();
                                GolfCustomerService.revokerPartnerAccessCard({ partnerAccessCardId: Number(d.id) }).then(res => {
                                    if (res.isSuccessful) {
                                        prop.stored.refreshGridData(true).then(() => {
                                            uiUtils.clearBusy();
                                            uiUtils.showSuccess(t(`recallSuccess`));
                                            prop.stored.refreshGridData(true);
                                        });
                                    } else {
                                        uiUtils.clearBusy();
                                        uiUtils.showError(res.message);
                                    }
                                })
                            }
                        });
                    },
                    hiddenIf: (d: PartnerAccessCardDto) => {
                        return !!d.endDate
                    },
                },
                {
                  title: "remove",
                  hiddenIf: (d: PartnerAccessCardDto) => !d.isReturned,
                  onClick: (d: PartnerAccessCardDto) => {
                    uiUtils.showConfirm({
                      title: t("ConfirmRemoveAccessCardTitle"),
                      content: (
                        <Trans
                          ns="golf-customer"
                          i18nKey="ConfirmRemoveAccessCard"
                          values={d}
                          components={{ italic: <i />, bold: <strong /> }}
                        ></Trans>
                      ),
                      onOk: () => {
                        GolfCustomerService.removePartnerAccessCard({
                          partnerAccessCardId: Number(d.id),
                        }).then((res) => {
                          if (res.isSuccessful) {
                            prop.stored.refreshGridData(true).then();
                          } else {
                            uiUtils.showError(res.message);
                          }
                        });
                      },
                    });
                  },
                },
            ],
            ns: prop.stored.getNamespaceLocale(),
            viewAction: (d: any) => {
                prop.stored.setOpenUpdateMemberShipCardModal(d);
            },
        }
    );
    return <>
        <AntTableWithDataPaged
          getPageResult={(d) => {
            return GolfCustomerService.getAccessCardByPartnerId(
              {
                body: {
                  ...d.body,
                  partnerId: prop.partnerId,
                },
              },
              {}
            );
          }}
          columns={columns}
          refreshDatasource={prop.stored.refreshDataState}
        />
      </>
  }
);
