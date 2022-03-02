import Template from "../components/Template";
import Header from "../components/Header";
import TablePackages from "../components/TablePackages";
import RouteGeneral from "../components/RouteGeneral";
import { useState, useEffect } from "react";
import PlanModal from "../components/PlanModal";
import useModal from "../hooks/useModal";
import styles from "../styles/Principal.module.css";
import { Row, Col, Menu, Popconfirm, message } from "antd";
import { CodepenOutlined, SendOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import useSession from "../hooks/useSession";
import { parseCookies } from "nookies";

export default function Principal() {
  const { visible, showModal, handleCancel } = useModal();
  const [visibleRoute, setVisibleR] = useState(true);
  const [visibleTable, setVisibleT] = useState(false);

  const { isLogged, logOut } = useSession();
  const router = useRouter();
  const [info, setInfo] = useState({});
  const { token } = parseCookies();

  useEffect(() => {
    if (!isLogged) {
      router.replace("/login");
    }
  }, [isLogged]);
  useEffect(async () => {
    await getInfoUser(token);
  }, []);

  const exit = async () => {
    await fetch("http://localhost:3000/api/user/?option=1", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idUser: info.idUser, token: token }),
    }).then((res) => res.json());
    logOut();
    router.replace("/login");
  };

  const getInfoUser = async (token) => {
    const result = await fetch(
      "http://localhost:3000/api/user/?option=1&token=" + token
    ).then((res) => res.json());
    setInfo(result.user);
    console.log(result.user);
  };

  const handleClick = (e) => {
    switch (e.key) {
      case "1":
        console.log("Logistica");
        setVisibleT(false);
        setVisibleR(true);
        break;
      case "2":
        console.log("Paquetes");
        setVisibleT(true);
        setVisibleR(false);
        break;

      default:
        break;
    }
  };

  return (
    <Template title="Principal">
      <Header name={info?.username + " " + info?.lastname} exit={exit} />
      <div className={styles["container"]}>
        <Row
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Col span={4}>
            <Menu
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["sub1"]}
              mode="inline"
              style={{
                height: "100%",
                borderRight: 1,
                paddingTop: "1.22rem",
                background: "white",
              }}
              onClick={handleClick}
            >
              <Menu.Item key="1" icon={<SendOutlined />}>
                <strong>Lógistica de Rutas</strong>
              </Menu.Item>
              <Menu.Item key="2" icon={<CodepenOutlined />}>
                <strong>Paquetes</strong>
              </Menu.Item>
            </Menu>
          </Col>
          {/* Main */}
          <Col span={20}>
            <div className={styles["container-main"]}>
              {visibleTable && <TablePackages idUser={info.idUser} />}
              {visibleRoute && (
                <RouteGeneral
                  info={info}
                  showModal={showModal}
                  setInfo={setInfo}
                />
              )}
            </div>
          </Col>
        </Row>
      </div>
      {visible && (
        <PlanModal
          visible={visible}
          showModal={showModal}
          handleCancel={handleCancel}
          title={"Crear Entregas"}
          idUser={info.idUser}
        />
      )}
    </Template>
  );
}
