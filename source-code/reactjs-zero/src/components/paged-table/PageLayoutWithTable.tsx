import React from 'react';
import {Row, Col, Space} from 'antd';

interface PageLayoutWithTableProps {
    title?: string;
    actionButtons?: React.ReactNode;
    searchForm: React.ReactNode;
    tableContent?: React.ReactNode;

}

export const PageLayoutWithTable = ({
                                        title,
                                        tableContent,
                                        searchForm,
                                        actionButtons,
                                    }: PageLayoutWithTableProps) => {
    return (
        <div>
            {/* Header */}
            {(title || actionButtons) && (
                <Row justify="space-between" align="middle" style={{marginBottom: 16}}>
                    <Col>
                        <h2 style={{marginBottom: 0}}>{title}</h2>
                    </Col>
                    <Col>
                        <Space>{actionButtons}</Space>
                    </Col>
                </Row>
            )}
            <div className={'ord-container-box'}>
                {/* Form Search */}
                {searchForm}
            </div>
            <div className={'ord-container-box ord-crud-list'}>
                {/* Table */}
                {tableContent}
            </div>


        </div>
    );
};
