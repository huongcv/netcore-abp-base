import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Alert, Checkbox, Col, Row, Spin} from "antd";
import {RoleService} from "@api/base/RoleService";
import {RolePagedDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";

interface RoleOption {
    value: string;
    label: React.ReactNode;
}

interface RoleCheckBoxProps {
    value?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
    maxResultCount?: number;
}

const RoleCheckBox: React.FC<RoleCheckBoxProps> = ({
                                                       value = [],
                                                       onChange,
                                                       disabled = false,
                                                       maxResultCount = 1000
                                                   }) => {
    const {t} = useTranslation();
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
    const [loading, setLoading] = useState(false);

    // Memoized role option renderer
    const createRoleOption = useCallback((role: RolePagedDto): RoleOption => ({
        value: role.id!,
        label: (
            <>
                <b className="inline-block" style={{minWidth: '80px'}}>
                    {role.code}
                </b>
                <span className="italic ml-2">{role.name}</span>
            </>
        )
    }), []);

    // Fetch roles with error handling
    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const result = await RoleService.getPaged({
                body: {
                    isActived: true,
                    maxResultCount,
                    skipCount: 0
                }
            });
            const roles: RolePagedDto[] = result.data?.items || [];
            const options = roles.map(createRoleOption);
            setRoleOptions(options);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [createRoleOption, maxResultCount]);

    // Handle checkbox change
    const handleChange = useCallback((checkedValues: string[]) => {
        onChange?.(checkedValues);
    }, [onChange]);

    // Memoized checkbox options
    const checkboxOptions = useMemo(() =>
        roleOptions.map((option) => (
            <Col className="mb-1" key={option.value} span={24}>
                <Checkbox value={option.value}>
                    {option.label}
                </Checkbox>
            </Col>
        )), [roleOptions]);

    useEffect(() => {
        fetchRoles().then();
    }, [fetchRoles]);

    if (loading) {
        return (
            <div className="text-center py-4">
                <Spin size="small"/>
                <span className="ml-2">Loading roles...</span>
            </div>
        );
    }
    if (roleOptions.length === 0) {
        return (
            <Alert
                message={t('No roles available')}
                type="info"
                showIcon
            />
        );
    }

    return (
        <Checkbox.Group
            style={{width: '100%'}}
            value={value}
            onChange={handleChange}
            disabled={disabled}
        >
            <Row gutter={16}>
                {checkboxOptions}
            </Row>
        </Checkbox.Group>
    );
};

export default RoleCheckBox;
