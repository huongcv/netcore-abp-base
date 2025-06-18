import React from 'react';
import {useStore} from "@ord-store/index";
import CreateModal from "@pages/2.Restaurant/Reservation/Upsert/CreateModal";
import UpdateModal from "@pages/2.Restaurant/Reservation/Upsert/UpdateModal";

const UpsertModal = () => {
    const {reservationStore: mainStore} = useStore();
    return (<>
        {
            mainStore.isAddNewEntity ? <CreateModal/> : <UpdateModal/>
        }
    </>)
};

export default UpsertModal;