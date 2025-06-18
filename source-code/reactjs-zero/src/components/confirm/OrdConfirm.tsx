import { confirmable, ConfirmDialog } from "react-confirm";
import React from "react";
import { Button, Col, Modal, Row } from "antd";
import { l } from "@ord-core/language/lang.utils";
import { DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

export interface OrdConfirmProps {
  title?: React.ReactNode;
  content?: React.ReactNode;
  okLabel?: string;
  isDanger?: boolean;
  cancelLabel?: string;
  data?: any;
  onOk: (data: any) => void;
  onCancel?: (data: any) => void;
  icon?: "default" | "remove" | "custome";
  customIcon?: React.ReactNode;
}
const OrdConfirm: ConfirmDialog<OrdConfirmProps, boolean> = (props) => {
  const Footer = (
    <>
      <Button
        onClick={() => cancelClick()}
        className="btn-default custome-btn-default"
      >
        {props?.cancelLabel || l.transCommon("no")}
      </Button>
      <Button
        onClick={() => okClick()}
        type="primary"
        className="btn-primary custome-btn-primary"
        danger={props.isDanger}
      >
        {props?.okLabel || l.transCommon("yes")}
      </Button>
    </>
  );
  const okClick = () => {
    props.proceed(true);
    props.onOk(props.data);
  };
  const cancelClick = () => {
    props.proceed(false);
    if (props.onCancel) {
      props.onCancel(props.data);
    }
  };
  const title = <div style={{ fontSize: 22 }}>{props.title}</div>;
  return (
    <>
      <Modal
        open={props.show}
        closable={false}
        maskClosable={false}
        title={title}
        onClose={cancelClick}
        footer={Footer}
      >
        <Row align="middle">
          <Col flex="0 1 100px" className="text-center">
            {props.icon === "remove" && (
              <DeleteOutlined style={{ fontSize: 80, color: "#c00a0a" }} />
            )}
            {(!props.icon || props.icon === "default") && (
              <InfoCircleOutlined style={{ fontSize: 80, color: "#e9890a" }} />
            )}
            {props.icon === "custome" && props.customIcon}
          </Col>
          <Col
            flex="1 1 200px"
            style={{
              fontSize: 20,
              paddingLeft: 12,
              paddingRight: 6,
            }}
          >
            {props.content}
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default confirmable(OrdConfirm);
