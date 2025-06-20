import {Link, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import MenuUtils from "@ord-core/layout/menu.utils";
import {useTranslation} from "react-i18next";
import {SideNavInterface} from "@ord-core/model/side-nav.type";
import {Space} from "antd";
import {useStore} from "@ord-store/index";
import {HomeIcon} from "@ord-components/icon/HomeIcon";
import {DefaultAppPrefixUrl} from "@ord-core/AppConst";
import Utils from "@ord-core/utils/utils";

export interface IItemRoute {
    title: string;
    route: string;
}

export const OrdBreadcrumb = (props: {
    mainTitle: string,
    items?: string[],
    itemsRoute?: IItemRoute[],
    hideHomeIcon?: boolean
}) => {
    const {mainTitle, items, itemsRoute} = props;
    const [t] = useTranslation('menu');
    const separator = <>
        <IconlyLight className={'mx-1 mt-[6px]'} width={20} type={'Arrow - Right 2.png'}></IconlyLight>
    </>
    return (<div className={'ord-page-breadcrumb'}>
        <Space wrap className="gap-1">
            <Space key={-1}>
                {!props.hideHomeIcon && (
                    <>
                        <Space className={'title'}>
                            <HomeIcon/>
                        </Space>
                        <Space>
                            {separator}
                        </Space>
                    </>
                )}
            </Space>

            {
                items && items.map((it, idx) => {
                    return <Space key={idx}>
                        <Space className={'title'}>
                            {t(it)}
                        </Space>
                        <Space>
                            {separator}
                        </Space>

                    </Space>;
                })
            }

            {
                itemsRoute?.length && !items?.length && itemsRoute.map((it, idx) => {
                    return <Space key={idx}>

                        <Space className={'title'}>
                            {
                                it.route != '' ?
                                    <Link className='hover:text-inherit' to={it.route}> {t(it.title)}</Link> :
                                    <span>{t(it.title)}</span>
                            }

                        </Space>
                        <Space>
                            {separator}
                        </Space>
                    </Space>;
                })
            }

            <Space className="primary">
                {t(mainTitle)}
            </Space>
        </Space>
    </div>);
}

export const PageBreadcrumb = () => {
    return (
        <>
            <PageBreadcrumbFormPathName pathname={location.pathname}></PageBreadcrumbFormPathName>
        </>
    );
}

export const PageBreadcrumbFormPathName = ({pathname, mainTitle: customMainTitle}: {
    pathname: string,
    mainTitle?: string
}) => {
    const [items, setItems] = useState<string[]>([]);
    const [mainTitle, setMainTitle] = useState<string>('');
    const {sessionStore} = useStore();

    useEffect(() => {
        const fullMenus = MenuUtils.getFlatMenu(sessionStore.systemCode);
        const currentPath = MenuUtils.removePrefixDefault(pathname);
        const matchedNode = fullMenus.find(x => x.path === currentPath);

        if (!matchedNode) return;

        const resolvedTitle = customMainTitle ?? matchedNode.title;
        setMainTitle(resolvedTitle);

        const breadcrumbItems: string[] = [];
        collectParentTitles(fullMenus, matchedNode, breadcrumbItems);

        // Tránh duplicate nếu đã set customMainTitle
        if (Utils.isNotNull(customMainTitle)) {
            breadcrumbItems.push(matchedNode.title);
        }
        setItems(breadcrumbItems);
    }, [pathname, customMainTitle, sessionStore.systemCode]);


    const collectParentTitles = (menuList: SideNavInterface[], node: SideNavInterface, result: string[]) => {
        if (!node.parentName) return;

        const parentNode = menuList.find(x => x.title === node.parentName);
        if (parentNode) {
            collectParentTitles(menuList, parentNode, result);
            result.push(parentNode.title);
        }
    };
    return (
        <>
            <OrdBreadcrumb mainTitle={mainTitle} items={items}></OrdBreadcrumb>
        </>
    );
}
