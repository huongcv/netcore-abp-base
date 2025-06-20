export interface ArrayServiceArrToTreeOptions<T extends object = any> {
    /** 编号项名，默认：`'id'` */
    idMapName?: string;
    /** 父编号项名，默认：`'parent_id'` */
    parentIdMapName?: string;
    /**
     * 根父编号值，默认会自动计算得到最合适的根父编号值，例如：
     *
     * @example
     * ```ts
     * const res = srv.arrToTree([
     *    { id: 2, parent_id: 'a', title: 'c1' },
     *    { id: 4, parent_id: 2, title: 't1' },
     *  ],
     *  { rootParentValue: 'a' });
     * ```
     */
    rootParentIdValue?: any;
    /** 子项名，默认：`'children'` */
    childrenMapName?: string;
    /** 转换成树数据时回调 */
    cb?: (item: T) => void;
}

export interface ArrayServiceArrToTreeNodeOptions<T extends object = any> {
    /** 编号项名，默认：`'id'` */
    idMapName?: string;
    /** 父编号项名，默认：`'parent_id'` */
    parentIdMapName?: string;
    /** 标题项名，默认：`'title'` */
    titleMapName?: string;
    /** 设置为叶子节点项名，若数据源不存在时自动根据 `children` 值决定是否为叶子节点，默认：`'isLeaf'` */
    isLeafMapName?: string;
    /** 节点 Checkbox 是否选中项名，默认：`'checked'` */
    checkedMapname?: string;
    /** 节点本身是否选中项名，默认：`'selected'` */
    selectedMapname?: string;
    /** 节点是否展开(叶子节点无效)项名，默认：`'expanded'` */
    expandedMapname?: string;
    /** 设置是否禁用节点(不可进行任何操作)项名，默认：`'disabled'` */
    disabledMapname?: string;
    /** 转换成树数据后，执行的递归回调 */
    cb?: (item: T, parent: T | null, deep: number) => void;
}
