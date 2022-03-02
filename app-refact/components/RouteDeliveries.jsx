import { Rdelivery } from "./Rdelivery";

export function RouteDeliveries({ deliveries }) {
  console.log(deliveries);
  return (
    <>
      {deliveries &&
        deliveries.map((delivery, i) => <Rdelivery key={i} {...delivery} />)}
    </>
  );
}
