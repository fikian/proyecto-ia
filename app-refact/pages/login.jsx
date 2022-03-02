import Template from "../components/Template";
import { useEffect, useState } from "react";
import styles from "../styles/Login.module.css";
import { Form, Typography, Input, Button, Divider, Tooltip } from "antd";
import { blue } from "@ant-design/colors";
import Image from "next/image";
import RegisterModal from "../components/RegisterModal";
import useModal from "../hooks/useModal";
import useSession from "../hooks/useSession";
import { useRouter } from "next/router";

const { Title } = Typography;

export default function Login() {
  const { visible, showModal, handleCancel } = useModal();
  const [sesion, setForm] = useState({
    email: "",
    password: "",
  });
  const { isLogged, login } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (isLogged) {
      router.replace("/principal");
    }
    console.log("Login: statusLogged - ", isLogged);
  }, [isLogged]);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...sesion, [name]: value });
  };
  const Sumit = async () => {
    const result = await login({ sesion });
    console.log("Summit ", result);
  };

  return (
    <Template title="Acceso">
      <div className={styles["container-main"]}>
        <div className={styles["container-img"]}>
          <Image src="/images/loginScreen.png" height={600} width={800} />
        </div>
        <div
          style={{ background: blue[0] }}
          className={styles["container-aside"]}
        >
          <div className={styles["container-form"]}>
            <Form
              name="login"
              initialValues={{ remember: true }}
              layout="vertical"
            >
              <Title style={{ textAlign: "center" }}>dLine</Title>
              <Form.Item
                label="Correo"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese su correo!",
                  },
                ]}
              >
                <Input
                  placeholder="Ingrese su correo"
                  value={0}
                  name="email"
                  onChange={handleChange}
                  value={sesion.email}
                />
              </Form.Item>
              <Form.Item
                label="Contraseña"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "¡Por favor ingrese su contraseña!",
                  },
                ]}
              >
                <Input.Password
                  placeholder="Ingrese su contraseña"
                  value={0}
                  name="password"
                  onChange={handleChange}
                  value={sesion.password}
                />
              </Form.Item>
              <Form.Item className={styles["a"]}>
                <Tooltip title="¿Resetear contraseña?">
                  <a href="#API">¿No recuerdas la contraseña?</a>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block onClick={Sumit}>
                  Entrar
                </Button>
              </Form.Item>
              <Divider />
            </Form>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button size="middle" onClick={showModal}>
                Registrarse
              </Button>
            </div>
          </div>
        </div>
      </div>
      {visible && (
        <RegisterModal
          visible={visible}
          showModal={showModal}
          handleCancel={handleCancel}
          title={"Registrate"}
        />
      )}
    </Template>
  );
}
