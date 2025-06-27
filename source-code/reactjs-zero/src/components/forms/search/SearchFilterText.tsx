import React, {useCallback, useMemo, useRef} from "react";
import {useTranslation} from "react-i18next";
import {Button, Col, Form, Input, Row, Space, Tooltip} from "antd";
import {debounce} from "lodash";
import {useHotkeys} from "react-hotkeys-hook";
import {ZoomInOutlined, ZoomOutOutlined} from "@ant-design/icons";

import {ISearchProp} from "@ord-components/forms/search/ISearchProp";
import {useResponsiveSpan} from "@ord-core/hooks/useResponsiveSpan";
import useAutoFocus from "@ord-core/hooks/useAutoFocus";
import {HotKeyScope} from "@ord-core/AppConst";
import {IconlyLight} from "@ord-components/icon/IconlyLight";
import {IconlyLightSearch} from "@ord-components/icon/IconlyLightSearch";
import FloatLabel from "@ord-components/forms/FloatLabel";

export interface ISearchFilterTextProps extends ISearchProp {
    onReset?: () => void;
    onSubmit?: () => void;
    hasAdvanceSearchBtn?: boolean;
    isHiddenAdvanceSearchBtnText?: boolean;
    ignoreAutoFocus?: boolean;
    placeHolder?: string;
    labelFilter?: string;
    isCustomReset?: boolean;
    iconSearchCustom?: React.ReactNode;
}

export const SearchFilterText: React.FC<ISearchFilterTextProps> = (props) => {
    const {
        hasAdvanceSearchBtn,
        isHiddenAdvanceSearchBtnText,
        placeHolder,
        iconSearchCustom,
        onReset,
        onSubmit,
        ignoreAutoFocus = false,
        labelFilter,
        isCustomReset = false,
        span = 6,
        ...rest
    } = props;
    const {t} = useTranslation('form');
    const form = Form.useFormInstance();

    // Refs
    const inputRef = ignoreAutoFocus ? useRef(null) : useAutoFocus();
    const btnSearchRef = useRef(null);

    // Watch values
    const isShowAdvanceSearch = Form.useWatch('isShowAdvanceSearch', form);

    // Memoized values
    const responsiveSpan = useResponsiveSpan(span);
    const searchPlaceholder = useMemo(() =>
            t(`searchTextPlaceholder.${placeHolder || 'common'}`),
        [t, placeHolder]
    );
    const filterLabel = useMemo(() =>
            labelFilter ?? t("filterSearch"),
        [labelFilter, t]
    );

    // Calculate button width
    const advanceButtonWidth = useMemo(() => {
        if (!hasAdvanceSearchBtn) return 40;
        return isHiddenAdvanceSearchBtnText ? 100 : 215;
    }, [hasAdvanceSearchBtn, isHiddenAdvanceSearchBtnText]);

    // Event handlers
    const handleReset = useCallback(() => {
        onReset?.();

        if (!isCustomReset && form) {
            const currentValue = form.getFieldValue(['extendUI', 'onResetSearchParameter']) || 0;
            form.setFieldValue(['extendUI', 'onResetSearchParameter'], currentValue + 1);
        }
    }, [onReset, isCustomReset, form]);

    const handleSubmit = useCallback(() => {
        onSubmit?.();
    }, [onSubmit]);

    const handleAdvanceSearchToggle = useCallback(() => {
        form.setFieldValue('isShowAdvanceSearch', !isShowAdvanceSearch);
    }, [form, isShowAdvanceSearch]);

    // Debounced handlers
    const debouncedReset = useMemo(
        () => debounce(handleReset, 250),
        [handleReset]
    );

    const debouncedSubmit = useMemo(
        () => debounce(handleSubmit, 250),
        [handleSubmit]
    );

    // Hotkeys
    const hotkeyScope = useMemo(() =>
            form.getFieldValue('hotKeyScopeId') || HotKeyScope.crudPageBase,
        [form]
    );

    useHotkeys('F3', (event) => {
        // @ts-ignore
        inputRef.current?.focus();
        // @ts-ignore
        btnSearchRef.current?.click();
        event.preventDefault();
    }, {
        scopes: [hotkeyScope],
        enableOnFormTags: true
    });

    // Render advance search button content
    const renderAdvanceButtonContent = useCallback(() => {
        if (isHiddenAdvanceSearchBtnText) {
            return isShowAdvanceSearch ? <ZoomOutOutlined/> : <ZoomInOutlined/>;
        }
        return isShowAdvanceSearch ? t('hiddenSearchAdvance') : t('showSearchAdvance');
    }, [isHiddenAdvanceSearchBtnText, isShowAdvanceSearch, t]);

    const advanceButtonTitle = useMemo(() => {
        if (!isHiddenAdvanceSearchBtnText) return "";
        return isShowAdvanceSearch ? t('hiddenSearchAdvance') : t('showSearchAdvance');
    }, [isHiddenAdvanceSearchBtnText, isShowAdvanceSearch, t]);

    // Render search icon
    const searchIcon = useMemo(() =>
            iconSearchCustom || <IconlyLight width={22} type="Search.svg"/>,
        [iconSearchCustom]
    );

    return (
        <>
            <Col {...rest} {...responsiveSpan}>
                <Row gutter={9}>
                    <Col flex="1 1 150px">
                        <FloatLabel label={filterLabel}>
                            <Space.Compact style={{width: '100%'}}>
                                <Form.Item name="filter" className="flex-auto">
                                    <Input ref={inputRef}
                                           prefix={<IconlyLightSearch/>}
                                           placeholder={searchPlaceholder}
                                           allowClear
                                    />
                                </Form.Item>

                                <Tooltip placement="top" title={t('refreshDataTable')}>
                                    <Button
                                        className="btn-other"
                                        type="default"
                                        style={{width: 44, height: 39}}
                                        icon={<IconlyLight width={22} type="Reload.svg"/>}
                                        onClick={debouncedReset}
                                    />
                                </Tooltip>
                            </Space.Compact>
                        </FloatLabel>
                    </Col>

                    <Col flex={`0 1 ${advanceButtonWidth}px`}>
                        <Space>
                            <Tooltip placement="top" title={t('search')}>
                                <Button
                                    ref={btnSearchRef}
                                    type="primary"
                                    htmlType={onSubmit ? 'button' : 'submit'}
                                    className="search-btn"
                                    onClick={debouncedSubmit}
                                    icon={searchIcon}
                                />
                            </Tooltip>

                            {hasAdvanceSearchBtn && (
                                <Button
                                    style={{
                                        width: isHiddenAdvanceSearchBtnText ? 40 : 156
                                    }}
                                    className="btn-other"
                                    type="default"
                                    title={advanceButtonTitle}
                                    onClick={handleAdvanceSearchToggle}
                                >
                                    {renderAdvanceButtonContent()}
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Col>

            {/* Hidden form fields */}
            <Form.Item noStyle name="isShowAdvanceSearch" initialValue={false} hidden/>
        </>
    );
};