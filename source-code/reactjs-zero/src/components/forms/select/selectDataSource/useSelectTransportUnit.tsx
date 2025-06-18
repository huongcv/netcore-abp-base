import { SelectDataSource } from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import { useSelectDataSource } from "@ord-core/hooks/useSelectDataSource";
import { useTranslation } from "react-i18next";

// Định nghĩa enum cho đơn vị vận chuyển (nếu cần)
enum TRANSPORT_UNIT {
  GHN = 1,
  GHTK = 2,
  VIETTEL_POST = 3,
  VNPOST = 4,
  JNT = 5,
  BEST_EXPRESS = 6,
  OTHER = 999,
}

export const useSelectTransportUnit = (): SelectDataSource => {
  const key = 'transportUnit';
  const { t } = useTranslation('enum');

  return useSelectDataSource(key, async () => {
    return [
      {
        value: TRANSPORT_UNIT.GHN,
        label: t('transportUnit.GHN'), // Giao Hàng Nhanh
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.GHN')),
      },
      {
        value: TRANSPORT_UNIT.GHTK,
        label: t('transportUnit.GHTK'), // Giao Hàng Tiết Kiệm
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.GHTK')),
      },
      {
        value: TRANSPORT_UNIT.VIETTEL_POST,
        label: t('transportUnit.ViettelPost'), // Viettel Post
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.ViettelPost')),
      },
      {
        value: TRANSPORT_UNIT.VNPOST,
        label: t('transportUnit.VNPost'), // Bưu điện Việt Nam
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.VNPost')),
      },
      {
        value: TRANSPORT_UNIT.JNT,
        label: t('transportUnit.JNT'), // J&T Express
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.JNT')),
      },
      {
        value: TRANSPORT_UNIT.BEST_EXPRESS,
        label: t('transportUnit.BestExpress'), // Best Express
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.BestExpress')),
      },
      {
        value: TRANSPORT_UNIT.OTHER,
        label: t('transportUnit.Other'), // Khác
        fts: Utils.toLowerCaseNonAccentVietnamese(t('transportUnit.Other')),
      },
    ];
  });
};