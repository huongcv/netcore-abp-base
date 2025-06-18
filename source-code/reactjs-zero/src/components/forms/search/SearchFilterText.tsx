import {useTranslation} from "react-i18next";
import {Button, Col, Form, Input, Row, Space, Tooltip} from "antd";
import React, {useRef} from "react";
import {ISearchProp} from "@ord-components/forms/search/ISearchProp";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import {debounce} from "lodash";
import {useHotkeys} from "react-hotkeys-hook";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {HotKeyScope} from "@ord-core/AppConst";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import FloatLabel from "@ord-components/forms/FloatLabel";
import {ZoomInOutlined, ZoomOutOutlined} from "@ant-design/icons";

interface SearchFilterTextProp extends ISearchProp {
    onReset?: () => void;
    onSubmit?: () => void;
    hasAdvanceSearchBtn?: boolean;
    isHiddenAdvanceSearchBtnText?: boolean;
    ignoreAutoFocus?: boolean;
    placeHolder?: string;
    labelFilter?: string;
    isCustomReset?: boolean;
    iconSearchCustom?: React.ReactNode
}

export const SearchFilterText = (props: SearchFilterTextProp) => {
    const {t} = useTranslation('common');
    const {hasAdvanceSearchBtn, isHiddenAdvanceSearchBtnText, placeHolder, iconSearchCustom, ...rest} = props;
    const form = Form.useFormInstance();
    const inputSearch = props.ignoreAutoFocus == true ? useRef(null) : useAutoFocus();
    const btnSearch = useRef(null);
    const resetClick = () => {
        if (props.onReset) {
            props.onReset();
        }

        if (!props.isCustomReset) {
            if (form) {
                form.setFieldValue('extendResetTick', Number(new Date()));
            }
        }
    }
    const submitClick = () => {
        if (props.onSubmit) {
            props.onSubmit();
        }
    }
    useHotkeys('F3', (event) => {
        // @ts-ignore
        inputSearch.current.focus();
        if (btnSearch.current && inputSearch.current) {
            // @ts-ignore
            btnSearch.current.click();
        }
        event.preventDefault();
    }, {scopes: [form.getFieldValue('hotKeyScopeId') || HotKeyScope.crudPageBase], enableOnFormTags: true});

    const onShowAdvanceSearch = () => {
        form.setFieldValue('isShowAdvanceSearch', !!!isShowAdvanceSearch_w);
    }
    const isShowAdvanceSearch_w = Form.useWatch('isShowAdvanceSearch', form);
    return (<>
        <Col {...rest} {...useResponsiveSpan(props?.span || 6)}>
            <Row gutter={9}>
                <Col flex="1 1 150px">
                    <FloatLabel label={props.labelFilter ?? t("filterSearch")}>

                        <Space.Compact style={{width: '100%'}}>
                            <Form.Item name='filter' className='flex-auto'>
                                <Input prefix={<IconlyLightSearch/>}
                                       placeholder={placeHolder ? placeHolder : t("filterSearch")}
                                       allowClear
                                    // autoFocus
                                       ref={inputSearch}/>
                            </Form.Item>

                            <Tooltip placement="top" title={t('refreshDataTable')}>
                                <Button className={'btn-other'} type='default' style={{width: 44, height: 39}}
                                        icon={<IconlyLight width={22} type={'Reload.svg'}/>}
                                        onClick={debounce(resetClick, 250)}>
                                </Button>
                            </Tooltip>
                        </Space.Compact>
                    </FloatLabel>

                </Col>
                <Col flex={'0 1 ' + (hasAdvanceSearchBtn ? (isHiddenAdvanceSearchBtnText ? 100 : 215) : 40) + 'px'}>
                    <Space>
                        <Tooltip placement="top" title={t('search')}>
                            <Button type='primary' htmlType={props.onSubmit ? 'button' : 'submit'}
                                    className={'search-btn'} ref={btnSearch}
                                    onClick={debounce(submitClick, 250)}
                                    icon={!!iconSearchCustom ? iconSearchCustom : <>
                                        <IconlyLight width={22} type={'Search.svg'}/>
                                    </>}>
                            </Button>
                        </Tooltip>

                        {
                            hasAdvanceSearchBtn &&
                            <Button style={{width: isHiddenAdvanceSearchBtnText ? 40 : 156}} className={'btn-other'}
                                    type='default'
                                    title={isHiddenAdvanceSearchBtnText ? isShowAdvanceSearch_w ? t('hiddenSearchAdvance') : t('showSearchAdvance') : ""}
                                    onClick={onShowAdvanceSearch}>
                                {isShowAdvanceSearch_w ? (isHiddenAdvanceSearchBtnText ?
                                    <ZoomOutOutlined/> : t('hiddenSearchAdvance')) : (isHiddenAdvanceSearchBtnText ?
                                    <ZoomInOutlined/> : t("showSearchAdvance"))}
                            </Button>
                        }
                    </Space>
                </Col>
            </Row>
        </Col>
        <div hidden>
            <Form.Item noStyle name='extendResetTick'></Form.Item>
            <Form.Item noStyle name='isShowAdvanceSearch' initialValue={false}></Form.Item>
        </div>
    </>);
}
