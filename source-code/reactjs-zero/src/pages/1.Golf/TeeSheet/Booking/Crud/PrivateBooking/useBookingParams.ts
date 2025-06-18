import {useParams} from 'react-router-dom';
import DateUtil from "@ord-core/utils/date.util";
import dayjs from "dayjs";

export const useBookingParams = () => {
    const {mode, courseId, playerNo, playDate, startTime, flightId} = useParams<{
        mode: string;
        courseId: string;
        playerNo: string;
        playDate: string;
        startTime: string;
        flightId: string;
    }>();
    return {
        mode,
        courseId: courseId,
        playerNo: playerNo ? Number(playerNo) : 1,
        playDate: dayjs(`${playDate} ${startTime}` , "DD-MM-YYYY HH:mm").toDate(),
        startTime,
        flightId: flightId ? Number(flightId) : undefined,
    };
};
