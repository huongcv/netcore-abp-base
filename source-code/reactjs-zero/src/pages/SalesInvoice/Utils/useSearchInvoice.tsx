import React, { useEffect, useState } from "react";
import { Flex, Tooltip } from "antd";
import { SaleInvoiceDto } from "@api/index.defs";
import { PriceCell } from "@ord-components/table/cells/priceCell";
import Utils from "@ord-core/utils/utils";
import { SaleInvoiceService } from "@api/SaleInvoiceService";
import DateUtil from "@ord-core/utils/date.util";
import { MoveType } from "@pages/StockManagement/Shared/Const/StockMoveConst";

export const useSearchInvoice = (
  searchValue: string,
  focusReady: boolean,
  loadMore: number,
  status: number
) => {
  const MAX_RESULT = 10;
  const MAX_ITEM_SEARCH_CLIENT = 1000;
  const [dataSearchClient, setDataSearchClient] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isPending, setIsPending] = useState(false);
  const [isSearchOnClient, setSearchOnClient] = useState(false);
  const [dataNotFull, setDataNotFull] = useState(false);
  const renderItem = (dto: SaleInvoiceDto) => ({
    value: "" + dto.id,
    data: dto,
    fts:
      Utils.toLowerCaseNonAccentVietnamese(dto.invoiceCode) +
      " " +
      Utils.toLowerCaseNonAccentVietnamese(dto.partnerName),
    label: (
      <div className="product-search">
        <div>
          <Flex>
            <b>{dto.invoiceCode}</b>
            <span className="text-red ms-2 inline">
              {DateUtil.toFormat(dto.invoiceDate)}
            </span>
          </Flex>
          <Flex>
            {
              // chỉnh sửa nhầm mục đích hiển thị ... khi tên quá dài và bị totalAmount đè lên
              !!dto.partnerName && (
                <Tooltip title={dto.partnerName}>
                  <b
                    className="text-red min-w-[40px] whitespace-nowrap overflow-hidden text-ellipsis block max-w-[60%]"
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    {dto.partnerName}
                  </b>
                </Tooltip>
              )
            }

            {dto.totalAmount && (
              <p className={"ms-3 italic"}>
                <span>{"Tổng tiền"}:</span>
                <span className={"ms-1"}>
                  <PriceCell value={dto.totalAmount} fixed={0} />
                </span>
              </p>
            )}
          </Flex>
        </div>
      </div>
    ),
  });
  const fetchData = async (isLoadMore: boolean) => {
    setIsPending(true);
    try {
      const skipCount = isLoadMore ? data.length : 0;
      const paged = await SaleInvoiceService.getPaged({
        body: {
          filter: searchValue,
          isActived: true,
          maxResultCount: MAX_RESULT,
          skipCount: skipCount,
          maxGetAllSize: MAX_ITEM_SEARCH_CLIENT,
          status: 4,
          moveType: MoveType.HoaDon, // chỉnh sửa ngày 26/03/2025 => thêm moveType chỉ lấy dũ liệu hóa đơn (invoice return)
        },
      });
      const totalCount = +(paged.totalCount || "0");
      const isSearchInClient =
        Utils.isNullOrEmpty(searchValue) &&
        !isLoadMore &&
        totalCount <= MAX_ITEM_SEARCH_CLIENT;
      if (isSearchInClient) {
        setSearchOnClient(true);
      }
      if (skipCount + (paged.items?.length || 0) >= totalCount) {
        setDataNotFull(false);
      }
      if (paged.items) {
        const optionSelectItems = paged?.items?.map((it) => renderItem(it));
        if (isSearchInClient) {
          setDataSearchClient([...optionSelectItems]);
        }
        if (isLoadMore) {
          setData([...data, ...optionSelectItems]);
        } else {
          setData(optionSelectItems);
        }
      }
    } catch (error) {
    } finally {
      setIsPending(false);
    }
  };
  useEffect(() => {
    if (!focusReady) {
      return;
    }
    if (isSearchOnClient) {
      const fts = Utils.toLowerCaseNonAccentVietnamese(searchValue);
      const filter = dataSearchClient.filter(
        (s) => s.fts && s.fts.indexOf(fts) > -1
      );
      setData([...filter]);
      setIsPending(false);
    } else {
      setData([]);
      setDataNotFull(true);
      fetchData(false).then();
    }
  }, [searchValue, focusReady]);
  useEffect(() => {
    if (loadMore > 0 && dataNotFull && !isSearchOnClient) {
      fetchData(true).then();
    }
  }, [loadMore]);
  return { data, isPending, isSearchOnClient };
};
