import { BuggyCurrentStatusEnum } from "@api/index.defs";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";

export const BuggyStatusCell: React.FC<{
    status?: BuggyCurrentStatusEnum;
  }> = (props) => {
    const { t } = useTranslation('common');
    const { t: tEnum } = useTranslation('comboEnum');
    
    const getStatusColor = (status: BuggyCurrentStatusEnum | undefined): string => {
      if (!status) return 'inherit';
      
      switch(status) {
        case 1:
          return '#52c41a';
        case 2:
          return '#1890ff';
        case 3:
          return '#faad14';
        case 4:
          return '#722ed1';
        case 5:
          return '#f5222d';
        default:
          return 'inherit';
      }
    };

    const getBackgroundColor = (color: string): string => {
      if (color === 'inherit') return 'inherit';
      return `${color}1A`; // lấy 
    };
  
    const getStatusText = (status: BuggyCurrentStatusEnum | undefined): string => {
      if (!status) return '';
      
      switch(status) {
        case 1:
          return tEnum('golfBuggyStatus.1');
        case 2:
          return tEnum('golfBuggyStatus.2');
        case 3:
          return tEnum('golfBuggyStatus.3');
        case 4:
          return tEnum('golfBuggyStatus.4');
        case 5:
          return tEnum('golfBuggyStatus.5');
        default:
          return '';
      }
    };
  
    if (!props.status) return null;

    const borderColor = getStatusColor(props.status);
    const backgroundColor = getBackgroundColor(borderColor);
    const textColor = borderColor;

    return (
      <Tag 
        style={{
          borderColor: borderColor,
          backgroundColor: backgroundColor,
          color: textColor,
        }}
        className="me-1 border"
      >
        {t(getStatusText(props.status))}
      </Tag>
    );
  };