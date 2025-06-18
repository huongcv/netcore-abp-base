import React, {useState} from "react";
import {Form, FormInstance, Row, TableColumnsType} from "antd";
import {PagedRequestDto, PagedResultDto} from "@ord-core/service-proxies/dto";
import {TableRowSelection} from "antd/es/table/interface";
import UiUtils from "@ord-core/utils/ui.utils";
import {AntTableWithDataPaged} from "@ord-components/table/AntTableWithDataPaged";
import {PanelRender} from "rc-table/lib/interface";

export interface ISearchBoxDataTableProp {
    searchForm?: (form: FormInstance) => React.ReactNode,
    searchBtnSpan?: number,
    searchBtnInCenterBottom?: boolean,
    searchButtonGroup?: React.ReactNode;
}

export interface IDataTableWithSearchProps {
    searchBox?: ISearchBoxDataTableProp,
    columns: TableColumnsType<any>,
    rowKey?: string,
    getPageResult: (data: PagedRequestDto) => Promise<PagedResultDto<any>>,
    pageSizeOptions?: string[] | number[];
    rowSelection?: TableRowSelection<any>;
    nsTrans?: string;
    refreshData?: number;
    title?: PanelRender<any>,
}


export const DataTableWithSearch = React.forwardRef((props: IDataTableWithSearchProps, ref) => {
    const [searchPrm, setSearchPrm] = useState<any>({});
    const [searchFormRef] = Form.useForm();
    const onSearch = async (data: any) => {
        setSearchPrm({...data});
    }
    return (<>
        {
            props?.searchBox?.searchForm &&
            <Form form={searchFormRef} layout='vertical'
                  onFinish={onSearch}
                  onFinishFailed={() => UiUtils.showCommonValidateForm()}>
                <Row gutter={16}>
                    {props.searchBox.searchForm(searchFormRef)}
                </Row>
            </Form>
        }
        <AntTableWithDataPaged getPageResult={(d) => {
            return props.getPageResult(d.body)
        }}
                               title={props.title}
                               searchForm={searchFormRef}
                               searchData={searchPrm}
                               refreshDatasource={props?.refreshData}
                               columns={props.columns}
                               rowSelection={props.rowSelection}

        />
    </>);
})
