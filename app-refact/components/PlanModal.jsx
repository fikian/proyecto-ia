import ReactDOM from "react-dom";
import styles from "../styles/PlanModal.module.css";
import { DeliveryList } from "./DeliveryList";
import { useState } from "react";
import {
  Modal,
  Form,
  Row,
  Col,
  Input,
  Typography,
  Button,
  Divider,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function PlanModal(props) {
  const [iduser, setID] = useState(props.idUser);
  const onKeyPressEvent = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!new RegExp("[0-9]").test(keyValue)) event.preventDefault();
    return;
  };

  const [listDeliveries, setDeliveries] = useState([]);
  const [entrega, setForm] = useState({
    username: "",
    lastname: "",
    address: "",
    colonia: "",
    numhouse: "",
    postalcode: "",
    city: "",
    state: "",
    idUser: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...entrega, [name]: value });
  };

  const onSubmitAdd = async () => {
    try {
      const result = await fetch(
        "http://localhost:3000/api/planDeliveries/?iduser=" + iduser,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ entrega }),
        }
      ).then((res) => res.json());
      setDeliveries([...listDeliveries, { ...result }]);
    } catch (error) {
      console.log(error);
    }
  };

  return ReactDOM.createPortal(
    <>
      <Modal
        title={props.title}
        visible={props.visible}
        footer={null}
        destroyOnClose={true}
        onCancel={props.handleCancel}
        width={"100vh"}
      >
        <div>
          <Row>
            <Col span={17} style={{ marginRight: "1rem" }}>
              <Form
                name="Entrega"
                initialValues={{ remember: true }}
                layout="vertical"
              >
                <Row gutter={[48, 8]}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Nombre del Cliente"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "¡Por favor ingrese el nombre del cliente",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese nombre del cliente"
                        name="username"
                        onChange={handleChange}
                        value={entrega.username}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Apellidos"
                      name="lastname"
                      rules={[
                        {
                          required: true,
                          message:
                            "¡Por favor ingrese los apellidos del cliente",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese los apellidos"
                        name="lastname"
                        onChange={handleChange}
                        value={entrega.lastname}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="ID Usuario"
                      name="idUser"
                      tooltip={{
                        title:
                          "Si el cliente no esta registrado deje vacio este campo",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input
                        placeholder="Ingrese ID del Usuario"
                        name="idUser"
                        onChange={handleChange}
                        value={entrega.idUser}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Nombre de la Calle"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "¡Por favor ingrese el nombre de la calle",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese el nombre de la calle"
                        name="address"
                        onChange={handleChange}
                        value={entrega.address}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Colonia/Municipio"
                      name="colonia"
                      rules={[
                        {
                          required: true,
                          message: "¡Por favor ingrese la colonia o municipio!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese el nombre de la colonia o municipio"
                        name="colonia"
                        onChange={handleChange}
                        value={entrega.colonia}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Número interior o exterior"
                      name="numhouse"
                      tooltip={{
                        title: "Si no tiene numero deje vacio esta casilla",
                        icon: <InfoCircleOutlined />,
                      }}
                    >
                      <Input
                        placeholder="S/N"
                        onKeyPress={onKeyPressEvent}
                        name="numhouse"
                        style={{ width: "64px" }}
                        onChange={handleChange}
                        value={entrega.numhouse}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Código Postal"
                      name="postalcode"
                      rules={[
                        {
                          required: true,
                          message: "¡Por favor ingrese el código postal!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="00000"
                        name="postalcode"
                        style={{ width: "64px" }}
                        onChange={handleChange}
                        onKeyPress={onKeyPressEvent}
                        value={entrega.postalcode}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label="Ciudad" name="city">
                      <Input
                        placeholder="Ingrese el nombre de la ciudad"
                        name="city"
                        onChange={handleChange}
                        value={entrega.city}
                      ></Input>
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item
                      label="Estado"
                      name="state"
                      rules={[
                        {
                          required: true,
                          message: "¡Por favor ingrese el nombre del estado!",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Ingrese el estado"
                        name="state"
                        onChange={handleChange}
                        value={entrega.state}
                      ></Input>
                    </Form.Item>
                  </Col>
                </Row>
                <div className={styles["container-btn-form"]}>
                  <Button danger>Cancelar</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    onClick={onSubmitAdd}
                  >
                    Cargar
                  </Button>
                </div>
              </Form>
            </Col>
            {/*tarjetas*/}
            <Col span={6} style={{ marginLeft: "1rem" }}>
              <Row gutter={[8, 16]} style={{ textAlign: "center" }}>
                <div className={styles["container-text"]}>
                  <Title style={{ margin: 0, padding: 0 }} level={4}>
                    Entregas
                  </Title>
                </div>
                <Divider style={{ margin: 0, padding: 0 }} />
                <DeliveryList
                  setDeliveries={setDeliveries}
                  listDeliveries={listDeliveries}
                  deliveries={listDeliveries}
                />
              </Row>
            </Col>
          </Row>
        </div>
      </Modal>
    </>,
    document.getElementById("modal-container")
  );
}
