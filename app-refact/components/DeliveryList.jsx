import { Delivery } from "./Delivery";

export function DeliveryList({ deliveries, setDeliveries, listDeliveries }) {
  return (
    <>
      {deliveries &&
        deliveries.map((delivery, i) => (
          <Delivery
            setDeliveries={setDeliveries}
            listDeliveries={listDeliveries}
            key={i}
            {...delivery}
          />
        ))}
    </>
  );
}
