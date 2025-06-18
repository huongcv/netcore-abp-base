import { List, Popover, Typography } from "antd";
import React, { useState } from "react";
import { useStore } from "@ord-store/index";
import UiUtils from "@ord-core/utils/ui.utils";
import { useTranslation } from "react-i18next";
import { ProductPriceListDetailService } from "@api/ProductPriceListDetailService";
import { ProductPriceListDetailDto, ProductPriceListDetailPartnerGroupRelDto } from "@api/index.defs";

export const PartnerGroupCell = ({ record, className }: { record: ProductPriceListDetailDto, className?: string }) => {
    const [groupNames, setGroupNames] = useState<ProductPriceListDetailPartnerGroupRelDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { t } = useTranslation(["price-list-detail"]);

    const fetchGroupNames = async () => {
        setLoading(true);
        try {
            const groups = await ProductPriceListDetailService.getPartnerGroupByDetailId({
                id: record.id as any
            });
            setGroupNames(groups);
        } catch (error) {
            console.error("Failed to fetch group names", error);
        } finally {
            setLoading(false);
            UiUtils.clearBusy();
        }
    };

    const handlePopoverVisibleChange = (visible: boolean) => {
        if (visible && groupNames.length === 0 && !loading) {
            fetchGroupNames();
        }
    };

    return (
        <div>
            <Popover
                content={
                    <div className="w-[230px] max-h-[400px]">
                        <List
                            bordered
                            dataSource={groupNames}
                            renderItem={(item) => (
                                <List.Item>
                                    <Typography.Text>{item.partnerGroupName}</Typography.Text>
                                </List.Item>
                            )}
                        />
                    </div>
                }
                placement="right"
                title={t("groupList")}
                onOpenChange={handlePopoverVisibleChange}
            >
                <a className={className ?? "text-blue-500 cursor-default"}>{t('groupCount', {
                    count: groupNames?.length ?? 0
                })}</a>
            </Popover>
        </div>
    );
};
