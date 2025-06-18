import {Button, Checkbox, CheckboxOptionType, CheckboxProps, Flex, Form, Input, Space, Spin} from "antd";
import * as React from "react";
import {EventHandler, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useStore} from "@ord-store/index";
import {GroupIcon} from "@ord-components/icon/GroupIcon";
import {SearchIcon} from "@ord-components/icon/SearchIcon";
import {ArrowLeftOutlined, MenuFoldOutlined, PlusOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {ArrowRightIcon} from "@ord-components/icon/ArrowRightIcon";
import {PriceListInput} from "@pages/SalesInvoice/Sell/components/price-list";
import Utils from "@ord-core/utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import {observer} from "mobx-react-lite";
import ThemeUtil from "@ord-core/theme/ord-theme.config";

export const LeftBar = observer((props: {
    getListHandler: EventHandler<any>,
    removeAllProductHandler: () => void,
}) => {
    const {t} = useTranslation(['sale-invoice', 'product-group-list', 'comboEnum']);
    const {saleInvoiceStore: mainStore, productGroupStore, sessionStore} = useStore();
    const {productStore: productStore} = useStore();
    const CheckboxGroup = Checkbox.Group;
    const [checkedList, setCheckedList] = useState<CheckboxOptionType[]>([]);
    const [options, setOptions] = useState<CheckboxOptionType[]>([]);
    let indeterminate = checkedList.length > 0 && checkedList.length < options.length;
    const checkAll = (options?.length === checkedList?.length) || checkedList?.length == 0;

    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();


    const onChange = (list: CheckboxOptionType[]) => {
        setCheckedList(list);
    };

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setCheckedList(e?.target?.checked ? options : []);
    };


    useEffect(() => {
        onFilter()
    }, [checkedList]);

    useEffect(() => {
        mainStore.getListProductGroup().then(resp => {
            if (resp?.totalCount) {
                const opts = resp.items?.map((it) => {
                    return {
                        label: it.groupName,
                        value: it.id,
                    } as CheckboxOptionType
                })
                updateDataOptions(opts ?? []);
            } else {
                setHasMore(false);
            }
        })
    }, []);
    useEffect(() => {
        if (productGroupStore.createOrUpdateEntitySaved) {
            const newValue = [{
                label: productGroupStore.createOrUpdateEntitySaved.groupName,
                value: productGroupStore.createOrUpdateEntitySaved.id,
            }, ...options];
            updateDataOptions(newValue ?? []);
        }
    }, [productGroupStore.createOrUpdateEntitySaved])

    function updateDataOptions(opts: CheckboxOptionType[]) {
        setOptions(opts ?? []);
        setFilteredOptions(opts ?? []);

        const displayIts = opts?.slice(0, MAX_VIEW);
        setDisplayItems(displayIts ?? []);
        setHasMore((displayIts?.length || 0) < (opts?.length || 0));

        setCheckedList([])

        indeterminate = (checkedList?.length || 0) > 0 && (checkedList?.length || 0) < (options?.length || 0)
    }

    const openAddProduct = () => {
        // let prTypeDefault = 1;
        // switch (sessionStore.currentShopType) {
        //     case 4:
        //         prTypeDefault = 4;
        //         break;
        //     case 206:
        //         prTypeDefault = 4;
        //         break;
        // }
        productStore.openCreateModal({
            // productTypeId: prTypeDefault,
        });
    }

    const closeSell = () => {
        return navigate("/");
    }

    const onFilter = () => {
        let groupIds = checkedList?.map((it) => it + "");
        if (checkAll) {
            groupIds = [];
        }
        props.getListHandler(groupIds)
    }

    const toggleMenuClicked = () => {
        setCollapsed(!collapsed);
    }

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [displayItems, setDisplayItems] = useState(filteredOptions);
    const MAX_VIEW = 100;
    const [hasMore, setHasMore] = useState(true);
    const loadMore = () => {
        if (displayItems.length >= filteredOptions.length) {
            setHasMore(false);
            return;
        }
        const listView = [...displayItems, ...filteredOptions.slice(displayItems.length, displayItems.length + MAX_VIEW)];
        setDisplayItems([...listView]);
    }
    useEffect(() => {
        if (options) {
            const normalizedSearchTerm = Utils.toLowerCaseNonAccentVietnamese(searchTerm.toLowerCase()).trim();
            // @ts-ignore
            const filtered = options.filter(option => Utils.toLowerCaseNonAccentVietnamese(option.label.toLowerCase()).includes(normalizedSearchTerm));
            setFilteredOptions(filtered);

            const listView = filtered.slice(0, MAX_VIEW);
            setDisplayItems(listView);
            setHasMore((listView?.length || 0) < (filtered?.length || 0));
        }
    }, [searchTerm]);


    return (<>

            <div className={`sidebar max-md:hidden flex flex-col justify-between bg-white my-[-0.75rem] ` +
                (collapsed ? 'collapsed w-[72px]' : 'expand w-2/12')}>
                <div
                    className={`flex flex-wrap items-center w-full ` + (collapsed ? 'justify-center' : 'justify-between')}>
                    <div className="!m-1 logo-vertical">
                        {
                            collapsed ?
                                <img onClick={() => navigate("/")} src={ThemeUtil.getLogoSimpleUrl}
                                     className="h-[100%] cursor-pointer mt-1 mb-4"/>
                                :
                                <img onClick={() => navigate("/")} src={ThemeUtil.getLogoUrl}
                                     className="h-[100%] cursor-pointer"/>
                        }
                    </div>
                    <Button
                        type="text"
                        icon={collapsed ? <Space.Compact><GroupIcon/><ArrowRightIcon/></Space.Compact> :
                            <MenuFoldOutlined/>}
                        onClick={() => toggleMenuClicked()}
                        style={{
                            fontSize: '16px',
                            marginInlineEnd: '-0.5rem'
                        }}
                    />
                </div>
                <div className='mt-[30px]' hidden={collapsed}>
                    <PriceListInput removeAllProductHandler={() => {
                        props.removeAllProductHandler();
                    }}/>
                </div>
                <div className="product-group flex-1 mb-2">
                    <h3 className="flex gap-2  text-xl font-semibold">
                        <GroupIcon/>
                        {t("productGroup")}
                    </h3>
                    <Form className="my-4">
                        <Form.Item>
                            <Input placeholder="Nhập nhóm sản phẩm"
                                   onChange={e => setSearchTerm(e.target.value)}
                                   prefix={<SearchIcon/>}></Input>
                        </Form.Item>
                    </Form>
                    <InfiniteScroll dataLength={displayItems?.length || 0}
                                    next={loadMore}
                                    hasMore={hasMore}
                                    loader={<Flex className="justify-center"><Spin/></Flex>}
                                    height={'calc(100vh - 23rem)'}>
                        <div className="flex flex-col gap-3">
                            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                                Tất cả
                            </Checkbox>
                            <CheckboxGroup className="flex flex-col gap-3" options={displayItems} value={checkedList}
                                           onChange={onChange}/>
                        </div>
                    </InfiniteScroll>
                </div>

                <Button onClick={openAddProduct} type='primary'><PlusOutlined/><span
                    className="text">{t('addNewProduct')}</span></Button>
                <Button onClick={closeSell} className="mt-2 bg-gray-200"><ArrowLeftOutlined/><span
                    className="text">{t('backToList')}</span></Button>
            </div>

        </>
    )
})
