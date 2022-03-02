import { PageHeader, Button } from "antd";
import { Image } from "next/image";
export default function PlanRoute(props) {
  return (
    <>
      <PageHeader
        pla={props.plan}
        ghost={false}
        title="Planea una ruta"
        extra={[
          <Button
            key="1"
            value="default"
            type="primary"
            onClick={props.showModal}
          >
            Planear Ruta
          </Button>,
        ]}
      ></PageHeader>
      {/*<Image src="/images/wait.png" height={600} width={800} />*/}
    </>
  );
}
