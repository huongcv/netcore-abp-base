import { Tooltip } from "antd";

interface EllipsisTextProps {
  text: string; // text value
  maxWidth: number; // Điều chỉnh chiều rộng tối đa
  className?: string;
  style?: React.CSSProperties;
}
// component hiển thị text với tooltip khi text quá dài
const OrdDisplayEllipsisTextLong: React.FC<EllipsisTextProps> = ({
  text,
  maxWidth,
  className,
  style = {},
}) => {
  return (
    <Tooltip title={text}>
      <div className="group relative block" style={{ width: "fit-content", paddingBottom: "10px"}}>
        <span
          className={`block whitespace-nowrap overflow-hidden text-ellipsis leading-normal ${className}`}
          style={{
            maxWidth: `${maxWidth}px`,
            ...style,
          }}
        >
          {text}
        </span>
      </div>
    </Tooltip>
  );
};

export default OrdDisplayEllipsisTextLong;
