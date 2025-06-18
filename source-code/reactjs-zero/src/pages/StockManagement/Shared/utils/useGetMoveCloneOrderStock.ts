import {useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import UiUtils from "@ord-core/utils/ui.utils";
import {ImportStockTicketDto, OrderStockTicketDto} from "@api/index.defs";

export const useGetMoveCloneOrderStock = (getById: (
    params: {
        idHash?: string
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
            const ticketDto: OrderStockTicketDto = await getById({
                idHash: cloneMove
            });
            if (ticketDto) {
                const cloneTicket = {
                    ...ticketDto
                } as OrderStockTicketDto;
                if (cloneTicket.moveDto) {
                    cloneTicket.moveDto = {
                        ...cloneTicket.moveDto,
                        id: '0',
                        moveStatus: undefined,
                        orderCode: undefined,
                        orderDate:  new Date(),
                        desiredDeliveryDate: new Date()
                    }
                }
                setCloneTicket({
                    ...cloneTicket
                });
            }
        } catch {

        } finally {
            UiUtils.clearBusy();
        }
    }
    return {
        cloneTicket
    };
}
