import { ArrowLeftOutlined, CheckCircleOutlined, EditOutlined, PlusOutlined, StopOutlined } from "@ant-design/icons";
import { GolfBookingGroupDto, GolfGolferGroupDetailDto, PartnerGroupDto } from "@api/index.defs";
import { SearchFilterText } from "@ord-components/forms/search/SearchFilterText";
import TableUtil from "@ord-core/utils/table.util";
import { useStore } from "@ord-store/index";
import { Button, Form, Row, Space, Spin, TableColumnsType, Tag } from "antd";
import { observer } from "mobx-react-lite";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { cloneDeep, debounce } from "lodash";
import { AntTableWithDataPaged } from "@ord-components/table/AntTableWithDataPaged";
import { PageTopTitleAndAction } from "@ord-components/common/page/PageTopTitleAndAction";
import { TopAction } from "@ord-components/crud/TopAction";
import { IActionBtn } from "@ord-components/crud/OrdCrudPage";
import { GolfBookingGroupService } from "@api/GolfBookingGroupService";
import dateUtil from "@ord-core/utils/date.util";
import { IconlyLight } from "@ord-components/icon/IconlyLight";
import { lazy, Suspense, useEffect, useState } from "react";
import uiUtils from "@ord-core/utils/ui.utils";

const CustomerGroupDetail = () => {
  const { golfCustomerGroupStore: mainStore, golfCustomerStore } = useStore();
  const { t } = useTranslation("golf-customer-group");
  const { t: tEnum } = useTranslation("enum");
  const [fromSeach] = Form.useForm();
  const { id } = useParams();
  const [groupData, setGroupData] = useState<GolfBookingGroupDto>();

  useEffect(() => {
    GolfBookingGroupService.getById({ id: Number(id) }).then(res => {
      if (res != null) {
        setGroupData(res);
      }
    })
  }, [id])

  const handleChangeIsActiveMembership = async (
    id: number,
    isActived: boolean
  ) => {
    try {
      uiUtils.setBusy();
      if (id == 0 || isActived == null || isActived == undefined) return;
      const update = await GolfBookingGroupService.changeMembershipStatus({
        id,
        isActived,
      });
      if (update.isSuccessful) {
        uiUtils.showSuccess(t(`updateIsActiveMembershipSuccessfully`));
        mainStore.refreshGridData(true);
      } else {
        uiUtils.showError(t(`updateMembershipIsActiveFaild`));
      }
    } catch (err: any) {
      uiUtils.showError(t(`updateIsActiveFaildErr500`) + err?.Message);
    } finally {
      uiUtils.clearBusy();
    }
  };

  const columns: TableColumnsType<GolfGolferGroupDetailDto> = TableUtil.getColumns(
    [
      {
        title: "partnerName",
        dataIndex: "partnerName",
        width: 200,
      },
      {
        title: "dateOfBirth",
        width: 100,
        render: (_: string, record: GolfGolferGroupDetailDto) => <>{record.dateOfBirth && dateUtil.toFormat(record.dateOfBirth, "DD/MM/YYYY")}</>,
      },
      {
        title: "phoneNumber",
        dataIndex: "phoneNumber",
        width: 100,
      },
      {
        title: "role",
        width: 140,
        render: (_: string, record: GolfGolferGroupDetailDto) => <>
          <span style={record.golferMemberType == 1 ? { color: "#F67B00" } : {}}>{tEnum(record.strGolferMemberType || "")}</span>
        </>,
      },
      {
        title: "memberShipFee",
        width: 100,
        render: (_: any, record: GolfGolferGroupDetailDto) => (
          <>
            {record?.isPaid ? (
              <Tag color="green">{t("daThanhToan")}</Tag>
            ) : (
              <Tag >
                {t("chuaThanhToan")}
              </Tag>
            )}
          </>
        ),
      },
      {
        title: "memberShipCard",
        width: 140,
        render: (_: string, record: GolfGolferGroupDetailDto) => <>

        </>,
      },
      {
        title: "status",
        dataIndex: 'isActived',
        align: "center",
        render: (_: any, record: any) => (<>
          {record?.isActived ?
            <Tag className="me-0 ord-cell-actived">
              {t("dang_hoat_dong")}
            </Tag>
            :
            <Tag className="me-0 ord-cell-inactived">
              {t("ngung_hoat_dong")}
            </Tag>}</>),
        width: 100,
      },
    ],
    {
      actions: [
        {
          title: "",
          content: (d: any) => {
            return (
              <div onClick={() => {
                let data = cloneDeep(d);
                data.id = data.partnerId;
                golfCustomerStore.setOpenAccessCardManageModal(data);
              }}>
                <IconlyLight type={'keyboard.svg'} width={21} />{" "}
                <span >{t("updateCard")}</span>
              </div>
            );
          },
        },
        {
          title: "",
          content: (d: GolfGolferGroupDetailDto) => {
            return d.isActived ? (
              <div
                onClick={() => {
                  handleChangeIsActiveMembership(Number(d.id), false);
                }}
              >
                <StopOutlined style={{ fontSize: 18 }} />{" "}
                <span className="ml-1">{t("changeIsActive.unActive")}</span>
              </div>
            ) : (
              <div
                onClick={() => {
                  handleChangeIsActiveMembership(Number(d.id), true);
                }}
              >
                <CheckCircleOutlined style={{ fontSize: 18 }} />{" "}
                <span className="ml-1">{t("changeIsActive.active")}</span>
              </div>
            );
          },
        },
        {
          title: "remove",
          onClick: (d: any) => {
            uiUtils.showConfirm({
              title: t('ConfirmRemoveMembershipTitle'),
              content: (<Trans ns="golf-customer-group"
                i18nKey="ConfirmRemoveMembership"
                values={d}
                components={{ italic: <i />, bold: <strong /> }}></Trans>),
              onOk: () => {
                GolfBookingGroupService.removeMemberShip({ body: d }).then(res => {
                  if (res.isSuccessful) {
                    onResetClick();
                  } else {
                    uiUtils.showError(res.message);
                  }
                })
              }
            });

          },
        },
      ],
      ns: mainStore.getNamespaceLocale(),
      viewAction: (d) => {
        mainStore.setOpenUpdateMemberModal(d);
      },
    }
  );


  const onResetClick = () => {
    fromSeach.resetFields();
    mainStore.refreshGridData(true).then()
  }

  const topActions: IActionBtn[] = [
    {
      content: <>
        <Button type='primary'
          onClick={() => {
            mainStore.setOpenCrudMemberModal();
          }}
        >
          <Space>
            <PlusOutlined />
          </Space>
          {t('addMember')}
        </Button></>,
      // permission: "Partner.Customer.Create",
    },
    {
      content: <>
        <Button onClick={() => {
          mainStore.backWard();
          mainStore.closeModal();
        }
        }>
          <ArrowLeftOutlined></ArrowLeftOutlined>
          {t("backWard")} (F10)
        </Button></>,
      permission: "Partner.Customer.Create",
    },
  ];

  const LazyModalCruMemberShip = lazy(
    () => import("./ModalCrudMemberShip")
  );

  const LazyModalAccessCardManage = lazy(
    () => import("@pages/1.Golf/GolfCustomer/Customer/Form/ModalAccessCardManage")
  );

  return (
    <>
      <PageTopTitleAndAction
        usingCustom={true}
        mainTitle={t("titlePage")}
        items={[t("titlePageLvl1"), t("titlePageLvl2")]}>
        <TopAction topActions={topActions} />
      </PageTopTitleAndAction>
      <Form form={fromSeach} className={'crud-search-box'}
        layout='vertical'
        onFinish={debounce((d) => {
          mainStore.searchData(d)
        }, 250)}>

        <div className={'ord-container-box'}>
          <Row gutter={[16, 8]}>
            <SearchFilterText span={8} onReset={onResetClick} />
          </Row>
        </div>
        <div className={'ord-container-box ord-crud-list'}>
          <div className="pb-3">{t("groupName")}: <span style={{ fontWeight: 600, color: "#0069E2" }}>{groupData?.groupName}</span></div>
          <AntTableWithDataPaged searchForm={fromSeach}
            getPageResult={(d) => {
              return GolfBookingGroupService.getPagedGroupDetail({
                body: {
                  ...d.body,
                  groupId: id,
                }
              }, {})
            }}
            columns={columns}
            searchData={mainStore.searchDataState}
            refreshDatasource={mainStore.refreshDataState}
          />
        </div>
      </Form>
      <Suspense fallback={<Spin />}>
        {mainStore.createOrUpdateMemberModal.visible && (
          <LazyModalCruMemberShip stored={mainStore}></LazyModalCruMemberShip>
        )}
      </Suspense>

      <Suspense fallback={<Spin />}>
        {golfCustomerStore.accessCardManageModel.visible && (
          <LazyModalAccessCardManage stored={golfCustomerStore}></LazyModalAccessCardManage>
        )}
      </Suspense>
    </>
  );
};

export default observer(CustomerGroupDetail);
