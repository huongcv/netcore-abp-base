import './loader.css';
import {observer} from "mobx-react-lite";
import {useStore} from "@ord-store/index";


const Loader = () => {
    const {uiStore} = useStore();
    return (
        uiStore.fullscreenLoading ?
            <div
                className={"loader fullscreen"}>
                <div className="preset">
                    <img src="/images/loader/spinner.svg" alt="loader"/>
                </div>
                <h3 className="loader-text">Vui lòng chờ...</h3>
            </div> : null
    )
}
export default observer(Loader);
