import ReactDOM from "react-dom";
import { Modal, Form, Row, Col, Input, Space, Button, Alert } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "../styles/Login.module.css";
import { useState } from "react";
export default function RegisterModal(props) {
  let [visible, setVisible] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const [formR, setForm] = useState({
    username: "",
    lastname: "",
    cell: "",
    email: "",
    password: "",
    address: "",
    colonia: "",
    numhouse: "",
    postalcode: "",
    city: "",
    state: "",
    token: "",
    plan: false,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...formR, [name]: value });
  };
  const onKeyPressEvent = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!new RegExp("[0-9]").test(keyValue)) event.preventDefault();
    return;
  };

  const onSumit = async () => {
    try {
      const result = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ formR }),
      }).then((res) => res.json());
      setMessage(result.result.message);
      if (!result.result.type) {
        setError(true);
      } else {
        setVisible(true);
      }
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
        {visible && (
          <Alert message={message} type="success" showIcon closable />
        )}
        {error && <Alert message={message} type="error" showIcon closable />}
        <Form
          name="register"
          initialValues={{ remember: true }}
          layout="vertical"
        >
          <Row gutter={[40, 15]}>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Nombre"
                name="username"
                rules={[
                  { required: true, message: "¡Por favor ingrese su nombre" },
                ]}
              >
                <Input
                  placeholder="Ingrese su nombre"
                  name="username"
                  value={formR.username}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>

            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Apellidos"
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese sus apellidos",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese sus apellidos"
                  name="lastname"
                  value={formR.lastname}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Telefono"
                name="cell"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese su número de telefono!",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su telefono"
                  name="cell"
                  value={formR.cell}
                  onKeyPress={onKeyPressEvent}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Correo"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese su correo electronico",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su correo electronico"
                  name="email"
                  value={formR.email}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese una contraseña!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Ingrese una contraseña"
                  name="password"
                  value={formR.password}
                  onChange={handleChange}
                ></Input.Password>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Confirmar contraseña"
                name="passwordC"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese una contraseña!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Ingrese una contraseña"
                  name="passwordC"
                ></Input.Password>
              </Form.Item>
            </Col>
            <Space></Space>
            <Col className="gutter-row" span={8}>
              <Form.Item
                label="Nombre de la calle"
                name="address"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese el nombre de la calle!",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese el nombre de la calle"
                  name="address"
                  value={formR.address}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
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
                  value={formR.colonia}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
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
                  name="numhouse"
                  style={{ width: "64px" }}
                  value={formR.numhouse}
                  onChange={handleChange}
                  onKeyPress={onKeyPressEvent}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
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
                  value={formR.postalcode}
                  onChange={handleChange}
                  onKeyPress={onKeyPressEvent}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item label="Ciudad" name="city">
                <Input
                  placeholder="Ingrese el nombre de la ciudad"
                  name="city"
                  value={formR.city}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
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
                  value={formR.state}
                  onChange={handleChange}
                ></Input>
              </Form.Item>
            </Col>
          </Row>
          <div className={styles["container-btn-register"]}>
            <Button onClick={props.handleCancel}>Cancelar</Button>
            <Button type="primary" htmlType="submit" onClick={onSumit}>
              Registrarse
            </Button>
          </div>
        </Form>
      </Modal>
    </>,
    document.getElementById("modal-container")
  );
}
