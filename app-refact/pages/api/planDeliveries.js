import { formatText } from "../../scripts/format";
import { MapsService } from "../../services/maps";
import { MongoDBService } from "../../services/mongo";
import { GraphD } from "../../scripts/graphD";
import prim from "../../scripts/prim";

export default async function handler(req, res) {
  const textF = new formatText();
  const serviceMaps = new MapsService();
  const serviceMongo = new MongoDBService();
  switch (req.method) {
    case "POST":
      try {
        const { iduser } = req.query;
        const { entrega } = req.body;
        let des = textF.createDirection(entrega);
        des = textF.cleanString(des);
        const id = textF.createID(entrega);
        const userDir = await serviceMongo.getDicUser(iduser);
        const point_origin = textF.createDirection(userDir);

        const info = await serviceMaps.getInfo(point_origin, des);

        const delivery = textF.createDelivery(info, id, entrega);
        if (entrega.idUser != "") {
          const register = true;
          await serviceMongo.insertDelivery(delivery, iduser, register);
        } else {
          const register = false;
          await serviceMongo.insertDelivery(delivery, iduser, register);
        }
        res.status(200).send(delivery);
        serviceMongo.close();
      } catch (error) {
        res.status(404).send({ MSJ: "ERRO-PLD-P" });
        console.log("ERROR-PLD-P" + error);
        serviceMongo.close();
      }

      break;

    case "DELETE":
      try {
        const { token } = req.query;
        const { delivery } = req.body;
        const info = await serviceMongo.getInfo(token);
        const r = await serviceMongo.deleteDelivery(delivery, info.idUser);
        res.status(200).send({ r });
        serviceMongo.close();
      } catch (error) {
        res.status(404).send({ msj: "ERROR-PLD-D" });
        serviceMongo.close();
      }

      break;
    case "GET":
      try {
        const { idUser } = req.query;
        const plan = await serviceMongo.getPlan(idUser);
        if (plan) {
          const route = await serviceMongo.getRoute(idUser);
          console.log(route);
          let info = textF.getInfo(route);
          res
            .status(200)
            .send({ route: route, distance: info.dis, duration: info.dur });
          serviceMongo.close();
        } else {
          const route = await serviceMongo.getRoute(idUser);

          const dir = await serviceMongo.getDicUser(idUser);

          const originUser = textF.createDirection(dir);
          const cleanOrigin = textF.cleanString(originUser);

          let map = textF.createTable(cleanOrigin, route);

          for (let [clave, _] of map) {
            let key = String(clave);
            let points = key.split("-");

            let res = await serviceMaps.getInfo(points[0], points[1]);
            let distance = res.rows[0].elements[0].distance.text;
            let duration = res.rows[0].elements[0].duration.text;
            let addressDes = res.destination_addresses[0];
            let addressOri = res.origin_addresses[0];
            map.set(clave, [distance, duration, addressDes, addressOri]);
          }

          //console.log(map);
          const g = new GraphD();
          const graph = g.createG(map);

          //console.log(graph);
          const minimumSpanningTree = prim(graph);
          //console.log(minimumSpanningTree.toString());
          let orden = minimumSpanningTree.toString();
          const RoutePlan = textF.createOrden(orden, map, route);
          await serviceMongo.updateDeliveries(idUser, RoutePlan);
          for (let index = 0; index < RoutePlan.length; index++) {
            await serviceMongo.updateOTW(
              RoutePlan[index].idUser ?? "",
              RoutePlan[index]
            );
          }
          await serviceMongo.updatePlan(idUser, true);
          let info = textF.getInfo(RoutePlan);
          res
            .status(200)
            .send({ route: RoutePlan, distance: info.dis, duration: info.dur });
          serviceMongo.close();
        }
      } catch (error) {
        console.log("ERRO-PL-02:" + error);
        res.status(404).send({ MSJ: "ERRO-PL-G" });
        serviceMongo.close();
      }
      break;

    default:
      res.status(404).send({ result: "no entendi tu peticion" });
      break;
  }
}
