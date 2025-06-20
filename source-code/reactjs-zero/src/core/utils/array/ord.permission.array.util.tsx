import {OrdPermissionTreeDataNode} from "@ord-core/config/permissions/tree-data/permission.tree.data";
import {l} from "@ord-core/language/lang.utils";
import React from "react";
import {TreeDataNode} from "antd";
import {PERMISSION_TREE} from "@ord-core/config/permissions/tree-data";
import ArrayUtil from "@ord-core/utils/array/array.util";
import {AppBootstrapDto} from "@ord-core/service-proxies/session/dto";
import {checkPermissionUser} from "@ord-core/utils/auth.utils";
import {HOST_PERMISSION_TREE} from "@ord-core/config/permissions/host-tree-data";

class OrdPermissionArrayUtil {
    private listPermissionBase: string[] = [];
    private _root: TreeDataNode[] | undefined;
    private _session: AppBootstrapDto | undefined;

    getTreeDataRoot(session: AppBootstrapDto, roleCode: any, forUpsertRoleTenant?: boolean): TreeDataNode[] {

        // @ts-ignore
        const isTenantAccount = session.user && session.user?.tenantId && session.user?.tenantDto;

        let permissionsTreeData = (isTenantAccount || forUpsertRoleTenant == true) ? PERMISSION_TREE : HOST_PERMISSION_TREE;
        if (roleCode && roleCode == 'ADMIN_TENANT' && !isTenantAccount) {
            permissionsTreeData = PERMISSION_TREE;
        }
        this.listPermissionBase = [];
        this._session = session;

        this._root = [
            {
                title: l.trans('permission.All'),
                key: 'root',
                //@ts-ignore
                children: permissionsTreeData.map((it, _) => {
                    if (!!it?.name) {
                        const singleNode = this.getNodes([
                            {
                                name: it.name,
                                children: [],
                                actions: []
                            }
                        ]);
                        if (singleNode.length > 0) {
                            return {
                                title: l.trans('permission.' + it.name),
                                key: it.name,
                            };
                        }
                        return {
                            key: 'hidden',
                            title: 'ignore'
                        };
                    }
                    
                    const nodes = this.getNodes(it.items || []);
                    if (nodes.length > 0) {
                        const treePermission = ArrayUtil.arrToTreeNode(nodes, {
                            idMapName: 'name',
                            parentIdMapName: 'parentName',
                            titleMapName: 'title',
                        });
                        return {
                            title: l.trans('permission.group.' + it.groupName),
                            key: it.groupName,
                            children: [...treePermission]
                        };
                    } else {
                        return {
                            key: 'hidden',
                            title: 'ignore'
                        };
                    }
                }).filter(s => s.key !== 'hidden')
            }
        ];
        // @ts-ignore
        return this._root;
    }

    private getNodes = (items: OrdPermissionTreeDataNode[]) => {
        const flatNode = this.flattenMenu(items)
            .filter(x => this._session && checkPermissionUser(this._session, x.name));
        if (!flatNode || flatNode.length <= 0) {
            return [];
        }
        flatNode.forEach(it => {
            if (it?.actions?.length > 0) {
                this.listPermissionBase.push(it.name);
                it.actions.forEach((actionName: string) => {
                    flatNode.push({
                        name: it.name + '.' + actionName,
                        parentName: it.name,
                        title: (<>
                            {l.trans('permission.action.' + actionName)}
                            <b className="ms-1">({l.trans('permission.' + it?.name)})</b>
                        </>),
                        expanded: false
                    });
                });
                it.expanded = false;
            }
        });
        flatNode.forEach(it => {
            if (!it?.title) {
                it.title = l.trans('permission.' + it?.name);
                if (it?.expanded !== false) {
                    it.expanded = true;
                }
            }
        });

        return flatNode;
    }
    private flattenMenu = (menu: OrdPermissionTreeDataNode[], parentName = null) => {
        const result: any[] = [];

        function flatten(items: any, parentName: any) {
            for (const item of items) {
                const { children, ...rest } = item;
                result.push({ ...rest, parentName });
                if (children) {
                    flatten(children, rest.name);
                }
            }
        }

        flatten(menu, parentName);
        return result;
    }

    includePermissionBase(listPermissionName: string[]) {
        this.listPermissionBase.forEach(it => {
            if (!listPermissionName.includes(it)) {
                const existAction = listPermissionName.find(x => x.includes(it));
                if (existAction) {
                    listPermissionName.push(it);
                }
            }
        });
    }

    ignorePermissionBaseWhenSetGranted(granted: string[]) {
        if (granted) {
            try {
                return granted?.filter(x => !this.listPermissionBase.includes(x)) || [];
            } catch {

            }

        }
        return [];
    }

}

export default new OrdPermissionArrayUtil();
