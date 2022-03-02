import { Alert } from "antd";
import { useState } from "react";

export function AlertRegister(props) {
  return (
    <>
      <Alert
        message={props.message}
        description={props.description}
        type={props.type}
        showIcon
        closable
        afterClose={props.handleClose}
      />
    </>
  );
}
