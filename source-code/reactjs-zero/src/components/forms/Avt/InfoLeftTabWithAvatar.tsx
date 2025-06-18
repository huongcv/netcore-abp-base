import { CameraOutlined } from "@ant-design/icons"
import { UserIcon } from "@ord-components/icon/UserIcon"
import { Avatar } from "antd"

const InfoLeftTabWithAvatar = () => {
    return (
        <div style={{ position: 'relative' }}>
             <Avatar size={150}
                icon={<UserIcon style={{marginTop: '13px'}}/>}> </Avatar>
                <div style={{width: "30px", height: "30px", cursor: "pointer"}} className="absolute bottom-2 flex align-middle justify-center right-3 shadow-xl bg-white p-3 rounded-full">
                    <CameraOutlined />
                </div>
        </div>
    )
}
export default InfoLeftTabWithAvatar