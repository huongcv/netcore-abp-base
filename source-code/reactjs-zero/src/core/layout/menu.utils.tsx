import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import complexMenuSuperAdmin from "../../Router/complexMenuSuperAdmin";

import {SideNavInterface} from "@ord-core/model/side-nav.type";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {Link} from "react-router-dom";
import React from "react";
import {l} from "@ord-core/language/lang.utils";
import {
    DefaultAppPrefixUrl,
    DefaultHostPrefixUrl,
    PACKAGE_TEST_CODE,
    SystemCodeType,
    UserConst
} from "@ord-core/AppConst";
import {ShopTypeEnum} from "@ord-store/sessionStore";


class MenuUtils {
    private _menu = [];
    private _isLoaded = false;
    private _flatMenu: any[] = [];
    private _isSuperAdmin = false;
    private _isSuperAdminUser = false;


    getFlatMenu(systemCode: SystemCodeType) {
        return [
            ...(this.flattenMenu(complexMenuSuperAdmin)),
            // ...(systemCode === "golf" ? this.flattenMenu(complexMenuGolf) : []),
            // ...(systemCode === "restaurant" ? this.flattenMenu(complexMenuRestaurant) : []),
            // ...(systemCode === "shop" || systemCode === "hotel" ? this.flattenMenu(complexMenu) : []),
        ]
    }

    getMenuItems(session: AppBootstrapDto, systemCode: SystemCodeType) {
        if (this._isLoaded) {
            return this._menu;
        }
        this._isSuperAdmin = session?.user?.isSuperAdmin ?? false;
        this._isSuperAdminUser = session.user?.level == UserConst.SaUserLevel;
        const isPharmacyShop = session?.currentShopType === ShopTypeEnum.NhaThuoc;
        const isPackageTest = PACKAGE_TEST_CODE.some(x => x === session?.user?.packageRegistrationCode);

        // @ts-ignore
        const flatMenu = this.getFlatMenu(systemCode)
            .filter((s: SideNavInterface) => {
                if (!isPharmacyShop && s.keyCheck === 999) {
                    return false;
                }

                // //Nếu là gói test thì ẩn chức năng kho và nhân sự
                if (isPackageTest === true && (s?.key === 'menu.stockManagement' || s?.key === 'menu.human')) {
                    return false;
                }

                return checkPermissionUser(session, s?.permission);
            }).map(it => {
                if (it.isLeaf && it.path) {
                    it.label = (<Link to={it.path}>{l.trans('menu.' + it.title)}</Link>);
                    it.title = l.trans('menu.' + it.title);
                    it.key = it.path;
                } else {
                    it.label = l.trans('menu.' + it.title);
                }
                return {
                    ...it,
                }
            });
        this._flatMenu = flatMenu;
        this._menu = this.filterTree(this.buildTree(flatMenu)).filter((it: {
            isLeaf: boolean;
            children: string | any[];
        }) => {
            return it.isLeaf || it?.children?.length > 0;
        });
        this.convertToMenuItemAnt(this._menu);
        this._isLoaded = true;
        console.log(this._menu);
        return this._menu;

    }

    private flattenMenu(menu: SideNavInterface[], parentName?: string) {
        const result: SideNavInterface[] = [];

        function flatten(items: SideNavInterface[], parentName: string) {
            for (const item of items) {
                const {children, ...rest} = item;
                result.push({
                    ...rest,
                    parentName: parentName,
                    isLeaf: !(children && children?.length > 0),
                    key: item.title
                });
                if (children) {
                    flatten(children, rest.title);
                }
            }
        }

        // @ts-ignore
        flatten(menu, parentName);
        return result;
    }

    private buildTree(flatMenu: any[]) {
        const itemMap: any = {};
        const tree: any[] = [];

        flatMenu.forEach(item => {
            itemMap[item.title] = {...item};
        });

        flatMenu.forEach(item => {
            if (item.parentName) {
                if (!!itemMap[item.parentName]) {
                    if (!itemMap[item.parentName]?.children) {
                        itemMap[item.parentName]['children'] = [];
                    }
                    itemMap[item.parentName].children.push(itemMap[item.title]);
                }
            } else {
                tree.push(itemMap[item.title]);
            }
        });
        return tree;
    }

    private filterTree(data: any) {
        return data.reduce((acc: any, node: SideNavInterface) => {
            if (!(node.isLeaf === false && node.children && node.children.length === 0)) {
                const filteredNode = {...node};
                if (filteredNode.children && filteredNode.children.length > 0) {
                    filteredNode.children = this.filterTree(filteredNode.children);
                }
                acc.push(filteredNode);
            }
            return acc;
        }, []);
    }

    convertToMenuItemAnt(obj: any) {
        // Kiểm tra nếu obj là một mảng
        if (Array.isArray(obj)) {
            obj.forEach(item => this.convertToMenuItemAnt(item));
        }
        // Kiểm tra nếu obj là một đối tượng
        else if (typeof obj === 'object' && obj !== null) {
            delete obj.isLeaf; // Xóa thuộc tính isLeaf nếu tồn tại
            delete obj.parentName; // Xóa thuộc tính parentName nếu tồn tại
            Object.keys(obj).forEach(key => this.convertToMenuItemAnt(obj[key]));
        }
    }

    private removePrefix(url: string, prefix: string): string {
        const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape các ký tự đặc biệt trong prefix
        const regex = new RegExp(`^${escapedPrefix}`);
        return url.replace(regex, '');
    }

    removePrefixDefault(url: string): string {
        const r1 = this.removePrefix(url, DefaultAppPrefixUrl);
        return this.removePrefix(r1, DefaultHostPrefixUrl);
    }

    getOpenKeys(path: string[]) {
        if (this._flatMenu) {
            let f = this._flatMenu.find(x => x.path === path[0]);
            if (!f) {
                return [];
            }
            let rootNode = f.title;
            if (f.parentName) {
                for (let i = 0; i <= 6; i++) {
                    if (!f.parentName) {
                        return;
                    }
                    const parentNode = this._flatMenu.find(x => x.title === f.parentName);
                    if (parentNode) {
                        rootNode = parentNode.title;
                    }
                    if (parentNode && !!parentNode?.parentName) {
                        f = {...parentNode};
                    }
                }
            }
            return [rootNode];
        }
        return [];
    }
}

export default new MenuUtils();
