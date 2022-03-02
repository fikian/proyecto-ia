import Template from "../components/Template";
import { Typography, Avatar, Input, Alert } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { blue } from "@ant-design/colors";
import style from "../styles/Header.module.css";
import styles from "../styles/invite.module.css";
import { useState } from "react";
import { set } from "mongoose";

const { Title } = Typography;
const { Search } = Input;

export default function Status() {
  const [error, setError] = useState();
  const [visible, setVisible] = useState();
  const [info, setInfo] = useState("");
  const [id, setId] = useState("");
  const onSearch = (value) => {
    if (value) {
      setError(false);
      setVisible(false);
      setId(value.toUpperCase());
      submit(value.toUpperCase());
    } else {
      setError(true);
      setVisible(false);
    }
  };

  const submit = async (entrega) => {
    try {
      const result = await fetch(
        "http://localhost:3000/api/invite/?id=" + entrega
      ).then((res) => res.json());
      console.log(result.state);
      if (result.state != "error") {
        setError(false);
        setVisible(true);
        setInfo(result.state ?? "La entrega aun no se encuentra en camino");
      } else {
        setVisible(false);
        setError(true);
        setInfo("El Id ingresado es erroneo o no existe");
      }
    } catch (error) {
      console.log("ERROR-S", error);
    }
  };
  return (
    <>
      <Template title="Rastrear Paquete">
        <div style={{ background: blue[5] }}>
          <div className={style["container-header"]}>
            <Title level={3}>
              <span className={style["icon"]} />
              DLine
            </Title>
            <div className={style["container-session"]}>
              <Avatar size="small" icon={<UserOutlined />} />
              <p>Invitado</p>
            </div>
          </div>
        </div>

        <div className={styles["div-delivery"]}>
          {error && (
            <Alert
              style={{ marginBottom: "1rem" }}
              message="Error"
              description={info}
              type="error"
              showIcon
            />
          )}
          {visible && (
            <Alert
              style={{ marginBottom: "1rem" }}
              message={"Informacion sobre la entrega: " + id}
              description={"El estado de su entrega es: " + info}
              type="info"
              showIcon
            />
          )}
          <Search
            placeholder="Ingrese el id de la entrega"
            enterButton="Buscar"
            size="large"
            onSearch={onSearch}
          />
        </div>
      </Template>
    </>
  );
}
