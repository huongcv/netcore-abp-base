import React, { useState } from 'react';
import { Modal, Tabs, Input, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { TextArea } = Input;
const { Text } = Typography;

interface NoteModalWithTabsProps {
  visible: boolean;
  onOk: (values: { internalNote: string; printNote: string }) => void;
  onCancel: () => void;
}

const NoteModalWithTabs: React.FC<NoteModalWithTabsProps> = ({ visible, onOk, onCancel }) => {
  const { t } = useTranslation('form'); // Giả sử bạn dùng i18n
  const [internalNote, setInternalNote] = useState<string>('');
  const [printNote, setPrintNote] = useState<string>('');

  const handleOk = () => {
    onOk({ internalNote, printNote });
  };

  return (
    <Modal
      title={t('noteTitle')} // "GHI CHÚ"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      okText={t('ok')}
      cancelText={t('cancel')}
      width={400}
      style={{ padding: '16px' }}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab={t('internalNote')} key="1">
          <Text strong>{t('note')}</Text> 
          <TextArea
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            placeholder={t('notePlaceholder')} 
            rows={4}
            style={{ marginTop: '8px' }}
          />
        </TabPane>
        <TabPane tab={t('printNote')} key="2">
          <Text strong>{t('note')}</Text>
          <TextArea
            value={printNote}
            onChange={(e) => setPrintNote(e.target.value)}
            placeholder={t('notePlaceholder')} 
            rows={4}
            style={{ marginTop: '8px' }}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default NoteModalWithTabs;