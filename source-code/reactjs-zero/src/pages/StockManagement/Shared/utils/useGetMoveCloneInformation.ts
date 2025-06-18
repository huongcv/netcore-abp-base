import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import _ from "lodash";
export const useGetMoveCloneInformation = (getById: (
    params: {
        idHash: string
    }
) => Promise<any>) => {
    const [cloneTicket, setCloneTicket] = useState<any>(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const cloneMove = searchParams.get('cloneMove');
    useEffect(() => {
        if (cloneMove) {
            loadMove(cloneMove).then();
        }
    }, [cloneMove]);
    const loadMove = async (cloneMove: string) => {
        UiUtils.setBusy();
        try {
            const result = await getById({
                idHash: cloneMove
            });

            if(!result.isSuccessful){
                UiUtils.showError(result.message)
                return;
            }

            const cloneTicket = {
                ...result.data
            };

            if (cloneTicket.moveDto) {
                const omitMove = _.omit(cloneTicket.moveDto,
                    ['moveId', 'moveHashId', 'moveCode', 'moveStatus']);
                cloneTicket.moveDto = {
                    ...omitMove
                }
            }

            setCloneTicket({
                ...cloneTicket
            });
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    return {
        cloneTicket
    };
}
