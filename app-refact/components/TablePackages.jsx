import { Table, Button, Dropdown, Menu } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const columns = [
  {
    title: "Entrega",
    dataIndex: "package",
    key: "package",
  },
  {
    title: "Estatus",
    dataIndex: "state",
    key: "state",
  },
  {
    title: "Fecha de Recibido",
    dataIndex: "date",
    key: "date",
  },
];

export default function TablePackages(props) {
  const [idUser, setID] = useState(props.idUser);
  const [dataTable, setDataT] = useState([]);
  const [dataTableAux, setDataAux] = useState([]);
  useEffect(async () => {
    await getPackages(idUser);
  }, []);

  const getPackages = async (idUser) => {
    const result = await fetch(
      "http://localhost:3000/api/user/?option=2&iduser=" + idUser
    ).then((res) => res.json());
    setDataT(result.data2);
    setDataAux(result.data2);
  };

  function getPackagesR(dataTable) {
    let result = [];
    console.log("holi");
    for (let index = 0; index < dataTable.length; index++) {
      if (dataTable[index].state == "Recibido") {
        result.push(dataTable[index]);
      }
    }
    setDataAux(result);
  }

  function getPackagesE(dataTable) {
    let result = [];
    for (let index = 0; index < dataTable.length; index++) {
      if (dataTable[index].state == "En camino") {
        result.push(dataTable[index]);
      }
    }
    setDataAux(result);
  }
  function handleMenuClick(e) {
    console.log("click", e.key);
    switch (e.key) {
      case "1":
        console.log("Mostrar solo recibidos");
        getPackagesR(dataTable);
        break;
      case "2":
        console.log("Mostrar solo en camino");
        getPackagesE(dataTable);
        break;
      case "3":
        console.log("Mostrar Todo");
        getPackages(idUser);
        break;
    }
  }
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">Recibido</Menu.Item>
      <Menu.Item key="2">En camino</Menu.Item>
      <Menu.Item key="3">Todos</Menu.Item>
    </Menu>
  );
  return (
    <>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: "1.5rem",
          }}
        >
          <Dropdown overlay={menu} placement="bottomLeft">
            <Button icon={<RightOutlined />} type="primary">
              Filtros
            </Button>
          </Dropdown>
        </div>
        <Table
          style={{ padding: "1rem 4rem" }}
          pagination={{ position: ["bottomCenter"] }}
          dataSource={dataTableAux}
          columns={columns}
        />
      </div>
    </>
  );
}
