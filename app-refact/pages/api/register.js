import { MongoDBService } from "../../services/mongo";
import { formatText } from "../../scripts/format";
let bcrypt = require("bcryptjs");

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const service = new MongoDBService();
      const { formR } = req.body;
      const textF = new formatText();
      const idUser = textF.createIDUser(formR);
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(formR.password, salt);
      formR.password = hash;
      const result = await service.register(formR, idUser);
      service.close();
      res.status(200).send({ result });
      break;

    default:
      res.status(404).send({ result: "no entendi tu peticion" });
      break;
  }
}
