import {useStore} from "@ord-store/index";
import EntityFormModal from "@ord-components/crud/EntityFormModal";
import {observer} from "mobx-react-lite";

const AppCommonEntityFormModal = () => {
    const {entityModalStore} = useStore();
    return (<>
        {entityModalStore.modalGroup.map(it => {
            return <EntityFormModal key={it.id} {...it.modal} entity={it.entity} onClose={()=>{
                entityModalStore.closeModal(it.id);
            }}/>
        })}
    </>);
}
export default observer(AppCommonEntityFormModal);
