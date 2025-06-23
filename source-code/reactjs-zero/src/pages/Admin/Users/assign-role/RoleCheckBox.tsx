import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Alert, Checkbox, Col, Row, Spin} from "antd";
import {RoleDetailDto} from "@api/base/index.defs";
import {useTranslation} from "react-i18next";
import {UserService} from "@api/base/UserService";

interface RoleOption {
    value: string;
    label: React.ReactNode;
    roleDetail: RoleDetailDto
}

interface RoleCheckBoxProps {
    value?: string[];
    onChange?: (values: string[]) => void;
    disabled?: boolean;
    userEncodedId?: string;
    onPermissionOfRoleSelectionChange?: (permissions: string[]) => void;
}

const RoleCheckBox: React.FC<RoleCheckBoxProps> = ({
                                                       value = [],
                                                       onChange,
                                                       disabled = false,
                                                       userEncodedId,
                                                       onPermissionOfRoleSelectionChange
                                                   }) => {
    const {t} = useTranslation();
    const [roleOptions, setRoleOptions] = useState<RoleOption[]>([]);
    const [loading, setLoading] = useState(false);

    // Memoized role option renderer
    const createRoleOption = useCallback((role: RoleDetailDto): RoleOption => ({
        value: role.id!,
        label: (
            <>
                <b className="inline-block" style={{minWidth: '80px'}}>
                    {role.code}
                </b>
                <span className="italic ml-2">{role.name}</span>
            </>
        ),
        roleDetail: role
    }), []);

    // Fetch roles with error handling
    const fetchRoles = useCallback(async () => {
        try {
            setLoading(true);
            const result = await UserService.getAssignableRoles({
                body: {
                    encodedId: userEncodedId
                }
            });
            const roles: RoleDetailDto[] = result.data || [];
            const options = roles.map(createRoleOption);
            setRoleOptions(options);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [createRoleOption, userEncodedId]);

    // Handle checkbox change
    const handleChange = useCallback((checkedValues: string[]) => {
        // Get selected roles with their permissions
        const roleSelection = roleOptions.filter(option =>
            checkedValues.includes(option.value)
        );
        // Collect all permissions and remove duplicates
        const allPermissions: string[] = [];
        roleSelection.forEach(role => {
            const permissionOfRole = role?.roleDetail?.permissionNames || [];
            allPermissions.push(...permissionOfRole);
        });
        // Remove duplicates using Set
        const uniquePermissions = [...new Set(allPermissions)];
        // Notify parent component about permissions change
        onPermissionOfRoleSelectionChange?.(uniquePermissions);
        if (onChange) {
            onChange(checkedValues);
        }
    }, [onChange, roleOptions]);

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
