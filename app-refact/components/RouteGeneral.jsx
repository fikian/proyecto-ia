import { PageHeader, Button, Row, Col, Popconfirm } from "antd";
import { route } from "next/dist/next-server/server/router";
import { useEffect, useState } from "react";
import styles from "../styles/PlanModal.module.css";
import { RouteDeliveries } from "./RouteDeliveries";

let today = new Date();
let date =
  today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();

let dateTime = date;
let numDeliveries = NaN;
let distance = "0 km";
let duration = "0 min";

export default function RouteGeneral({ info, showModal, setInfo }) {
  const [RouteD, setDeliveries] = useState(info.route);
  const text =
    "Si ingresa nuevos paquetes," +
    "\n" +
    "cuando tiene una ruta planeada esta se cancelara, " +
    "\n" +
    "¿Desea continuar?";

  useEffect(async () => {
    if (info.plan) {
      console.log("plan", info.plan);
      await getRoute();
    }
  }, []);
  const getRoute = async () => {
    try {
      const result = await fetch(
        "http://localhost:3000/api/planDeliveries/?idUser=" + info.idUser
      ).then((res) => res.json());
      numDeliveries = result.route.length;
      distance = result.distance;
      duration = result.duration;
      setDeliveries(result.route);
      setInfo({ ...info, plan: true });
    } catch (error) {
      console.log(error);
    }
  };
  const canceleRoute = async () => {
    try {
      const result = await fetch(
        "http://localhost:3000/api/user/?option=2&iduser=" + info.idUser,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      ).then((res) => res.json());
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <PageHeader
        ghost={false}
        title={"Logistica de Ruta: " + dateTime}
        extra={[
          <Button type="primary" onClick={getRoute}>
            Planear Ruta
          </Button>,
          <Popconfirm
            title={"Si cancela la ruta se eliminara de su cuenta"}
            okText="Si"
            onConfirm={canceleRoute}
            cancelText="No"
            placement="bottomRight"
          >
            <Button danger>Cancelar Ruta</Button>,
          </Popconfirm>,
          <Popconfirm
            title={text}
            onConfirm={showModal}
            okText="Si"
            cancelText="No"
            placement="bottomRight"
          >
            <Button>Ingreasar Entregas</Button>
          </Popconfirm>,
        ]}
      ></PageHeader>
      {!info.plan && (
        <div>
          <div className={styles["div-route"]}>
            <div>
              <h2>No tiene una ruta planeada o entregas cargadas</h2>
            </div>
          </div>
          <div className={styles["div-map-de"]}>
            <Col span={19}></Col>
            <Col span={5}>
              <div className={styles["container-btn-form"]}>
                <strong>Entregas</strong>
                <p>{info.route ? info.route.length : 0}</p>
              </div>
              {info.route && (
                <RouteDeliveries deliveries={info.route ? info.route : []} />
              )}
            </Col>
          </div>
        </div>
      )}
      {info.plan && (
        <>
          <div className={styles["div-route"]}>
            <div>
              <strong>Tiempo aproximado de ruta</strong>
              <p>{duration ? duration : "Cargando"}</p>
            </div>
            <div>
              <strong>Distancia a recorrer</strong>
              <p>{distance ? distance : "Cargando"}</p>
            </div>
          </div>
          <Row
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <div className={styles["div-map-de"]}>
              <Col span={19}></Col>
              <Col span={5}>
                <div className={styles["container-btn-form"]}>
                  <strong>Entregas</strong>
                  <p>{numDeliveries ? numDeliveries : "Cargando"}</p>
                </div>
                {RouteD && <RouteDeliveries deliveries={RouteD} />}
              </Col>
            </div>
          </Row>
        </>
      )}
    </>
  );
}
