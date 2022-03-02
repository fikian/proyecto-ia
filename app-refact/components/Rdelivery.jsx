import styles from "../styles/PlanModal.module.css";
import { Col, Divider } from "antd";

export function Rdelivery(props) {
  return (
    <>
      <Col span={24}>
        <div className={styles["container-delivery"]}>
          <strong style={{ fontSize: ".8rem" }}>{props.idDelivery}</strong>
          <p style={{ fontSize: ".8rem" }}>{props.status}</p>
        </div>
        <strong style={{ fontSize: ".8rem" }}>
          {props.destination_addresses}
        </strong>
        <Divider style={{ margin: 0, padding: 0 }} />
      </Col>
    </>
  );
}
