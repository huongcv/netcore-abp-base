import React, { useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import { TableTreeDto } from '@api/index.defs';
import { FnbTableService } from '@api/FnbTableService';
import _ from "lodash";

interface TableTreeSelectProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  onChangeValue?: (value: string | number, option: any) => void;
}

const TableTreeSelect: React.FC<TableTreeSelectProps> = ({ value, onChange, onChangeValue }) => {
  const [treeData, setTreeData] = useState<TableTreeDto[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await FnbTableService.getTreeSelect();
      if (res.isSuccessful && res.data) {
        setTreeData(res.data);
      }
    };
    fetchData();
  }, []);

  const handleOnChange = (value: any) => {
      onChange && onChange(value);

      const options = _.flattenDeep(treeData.map(x => x.children));
      const option = options.find(x => x.value === value);
      onChangeValue && onChangeValue(value, option);
  }

  return (
    <TreeSelect
      value={value}
      onChange={handleOnChange}
      treeData={treeData}
      allowClear
      showSearch
      treeDefaultExpandAll
      placeholder="Chọn khu vực/bàn"
      className="w-full"
      filterTreeNode={(input, node) => {
        const title = (node.title as string)?.toLowerCase() || '';
        const description = (node.description as string)?.toLowerCase() || ''; // nếu có
        return title.includes(input.toLowerCase()) || description.includes(input.toLowerCase());
      }}
    />
  );
};

export default TableTreeSelect;
