import {ActionLazy} from "@ord-components/table/cells/ActionLazy";
import React, {ReactNode} from "react";
import {LoginOutlined} from "@ant-design/icons";

class LoginWithAccount extends ActionLazy {
    icon(): ReactNode {
        return <LoginOutlined/>;
    }

    onClick(record: any): void {
        // UserService.loginPasswordless({
        //     body: {
        //         id: record.id
        //     }
        // }).then(d => {
        //     if (d.isSuccessful) {
        //         const token = d.data;
        //         // @ts-ignore
        //         JwtUtils.setTokenLoginWithOtherAccount(token?.accessToken, token?.refreshToken);
        //         window.location.href = paths.root;
        //     }
        // })
    }

}

export default LoginWithAccount;
