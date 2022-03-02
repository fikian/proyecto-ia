import { MongoDBService } from "../../services/mongo";

export default async function handler(req, res) {
  const serviceMongo = new MongoDBService();

  switch (req.method) {
    case "GET":
      try {
        const { id } = req.query;
        console.log(id);
        const info = await serviceMongo.getInfoPackage(id);
        if (info == undefined) {
          console.log("entre");
          res.status(200).send({ state: "error" });
        } else {
          res.status(200).send(info);
        }
        serviceMongo.close();
      } catch (error) {
        console.log("ERROR_GET_INV" + error);
        res.status(404).send({ msj: "Error" });
        serviceMongo.close();
      }

      break;

    default:
      res.status(404).send({ result: "no entendi la peticion INVITE" });
      break;
  }
}
