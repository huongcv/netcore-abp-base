import {useTranslation} from "react-i18next";
import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {PartnerDto, PARTNER_TYPE} from "@api/index.defs";
import {Space, Tag} from "antd";
import {GolfCaddyService} from "@api/GolfCaddyService";

export const ComboKeyCaddy = () => {
    return "PartnerCaddy";
};
export const useSelectCaddy = (): SelectDataSource => {
    const key = ComboKeyCaddy();

    return useSelectDataSource(key, async () => {
        const result = await GolfCaddyService.getCaddyComboOption();
        if (!result || result.length === 0) {
            return [];
        }
        return result.map((it) => {
            return {
                ...CaddyRenderSelectItem(it.data),
            };
        });
    });
};

export const CaddyRenderSelectItem = (dto: PartnerDto) => {
    return {
        value: dto.id,
        label: (
            <Space.Compact>
                <p>{dto.code}-{dto.name}</p>
            </Space.Compact>
        ),
        data: {...dto},
        fts: Utils.removeAccentVietnamese([
            dto.name,
            dto.code,
            dto.phone,
            dto.taxCode,
            dto.email,
            dto.address,
        ]),
    };
};

export const DisplayCaddyLabel = (props: { dto: PartnerDto }) => {
    const {dto} = props;
    const {t: tEnum} = useTranslation("enum");
    return (
        <>
            {dto && (
                <>
                    <Space.Compact>
                        <p style={{fontWeight: 500}} className="mr-1">
                            {dto.name}
                            {" - "}
                            {tEnum(`GENDER.${dto.gender}`)}
                        </p>
                    </Space.Compact>
                </>
            )}
        </>
    );
};
