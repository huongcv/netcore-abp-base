import {Select} from "antd";
import React, {useState} from "react";
import {LangUtil} from "@ord-core/language/lang.utils";

interface ILang {
    key: string,
    name: string,
    fullName: string
}

const SwitchLangue = () => {
    const [currentLang] = useState(LangUtil.getLang());
    const changeLang = (key: string) => {
        LangUtil.setLang(key);
        window.location.reload();
    }
    const languages: ILang[] = [
        {
            key: 'vi',
            name: 'VIE',
            fullName: 'Tiếng Việt'
        },
        {
            key: 'en',
            name: 'ENG',
            fullName: 'English'
        }
    ]
    const items = languages.map((it, idx) => {
        return {
            value: it.key,
            label: (<span className="bold">{it.name}</span>),
            key: idx,
            fullName: it.fullName
        }
    });

    return (
        <Select options={items}
                value={currentLang} onChange={changeLang}
                optionRender={(opt) => {
                    return <span className={'font-semibold'}>
                        {opt.label} - {opt.data?.fullName}
                    </span>
                }}>
        </Select>
    )
}
export default SwitchLangue;
