import { Typography, Avatar, Button, Popover } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { blue } from "@ant-design/colors";
import styles from "../styles/Header.module.css";

const { Title } = Typography;
const content = (
  <div className={styles["pop"]}>
    <p>Cerrar Sesion</p>
  </div>
);
export default function Header(props) {
  return (
    <>
      <div style={{ background: blue[5] }}>
        <div className={styles["container-header"]}>
          <Title level={3}>
            <span className={styles["icon"]} />
            DLine
          </Title>
          <div className={styles["container-session"]}>
            <Avatar size="small" icon={<UserOutlined />} />
            <p>{props.name ? props.name : "Cargando"}</p>
            <Popover content={content}>
              <Button
                type="text"
                style={{ color: "white" }}
                icon={<LogoutOutlined />}
                onClick={props.exit}
                size="small"
              />
            </Popover>
          </div>
        </div>
      </div>
    </>
  );
}
