import {SelectDataSource} from "@ord-components/forms/select/selectDataSource/selectDataSource";
import Utils from "@ord-core/utils/utils";
import {useSelectDataSource} from "@ord-core/hooks/useSelectDataSource";
import {ShopService} from "@api/ShopService";
import {ChannelService} from "@api/ChannelService";

export const useChannel = (): SelectDataSource => {
    const key = 'Channel';

    return useSelectDataSource(key, async () => {
        const result = await ChannelService.getComboOptions();
        return Utils.mapCommonSelectOption(result);
    });
};
