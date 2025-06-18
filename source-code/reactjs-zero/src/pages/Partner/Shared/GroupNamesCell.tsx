import { List, Popover } from "antd";

export const GroupNamesCell = (props: {
  groupNames: string;
  title: string;
}) => {
  const { groupNames, title } = props;
  const groupList = groupNames
    ? groupNames.split(", ").map((name) => name.trim())
    : [];

  return (
    <Popover
      content={
        groupList.length ? (
          <List
          bordered
            size="small"
            dataSource={groupList}
            renderItem={(name) => <List.Item>- {name}</List.Item>}
          />
        ) : (
          "Không có nhóm"
        )
      }
      title={title}
    >
      <div className="max-w-[200px] text-ellipsis overflow-hidden cursor-pointer">
        {groupNames != null ? groupNames : "-"}
      </div>
    </Popover>
  );
};
