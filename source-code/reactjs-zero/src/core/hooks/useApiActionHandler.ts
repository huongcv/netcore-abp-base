import {useCallback} from 'react';
import {ApiActionHandler, ApiActionOptions} from '@ord-core/utils/api/api-action.handler';
import {ICommonResultDtoApi} from "@ord-components/paged-table/types";

export function useApiActionHandler() {
    const executeApiAction = useCallback(<T>(
        apiCall: () => Promise<ICommonResultDtoApi<T>>,
        options: ApiActionOptions<T> = {}
    ) => {
        return ApiActionHandler.execute(apiCall, options);
    }, []);
    return {executeApiAction};
}
