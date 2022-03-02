import { MongoDBService } from "../../services/mongo";
import { formatText } from "../../scripts/format";
import { Auth } from "../../services/auth";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  const service = new MongoDBService();
  const auth = new Auth();
  const formt = new formatText();
  switch (req.method) {
    case "POST":
      try {
        const { sesion } = req.body;
        const data = await service.login(sesion);
        console.log("Login", data);
        if (data !== null) {
          console.log("Login- entre", data);
          if (await auth.validate(data, sesion)) {
            let token = uuidv4();
            await service.setToken(data.idUser, token.toString());
            res.status(200).send({ token });
            service.close();
          } else {
            res
              .status(403)
              .send({ token: "", msj: "Contraseña o Correo erroneos" });
            service.close();
          }
        } else {
          res
            .status(404)
            .send({ token: "", mjs: "El usuario no esta registrado" });
          service.close();
        }
      } catch (error) {
        res.status(403).send({ resp: "Error-U-Auth" });
        service.close();
        console.log(error);
      }
      break;

    case "GET":
      try {
        const { iduser, option, token } = req.query;
        console.log("iduser: ", iduser, "option: ", option, "token: ", token);
        switch (option) {
          case "1":
            console.log("option: ", option);
            console.log("token: ", token);
            let info1 = await service.getInfo(token);
            console.log(info1);
            const user = formt.infoUser(info1);
            res.status(200).send({ user });
            service.close();
            break;
          case "2":
            console.log("idUser: ", iduser);
            console.log("option: ", option);
            let info2 = await service.getPackages(iduser);
            const data2 = formt.cretalistTable(info2);
            res.status(200).send({ data2 });
            service.close();
            break;
          case "3":
            console.log("idUser: ", iduser);
            console.log("option: ", option);
            let info3 = await service.getPackagesR(iduser);
            const data3 = formt.cretalistTable(info3);
            res.status(200).send({ data3 });
            service.close();

          default:
            console.log("Error-Get: " + error);
            res.status(403).send({ resp: "Error-02" });
            break;
        }
      } catch (error) {
        console.log("Error-Get: " + error);
        res.status(403).send({ resp: "Error-02" });
        service.close();
      }
      break;

    case "DELETE":
      const { option, iduser } = req.query;
      const { idUser, token } = req.body;
      try {
        switch (option) {
          case "1":
            console.log(token, idUser);
            const result = await service.deleteToken(idUser, token);
            service.close();
            res.status(200).send({ result });
            break;
          case "2":
            console.log("iduser: ", iduser);
            const route = await service.getRoute(iduser);
            console.log(route);
            for (let index = 0; index < route.length; index++) {
              route[index].state = "Cancelado";
              await service.updateOTW(route[index].idUser, route[index]);
            }
            await service.updateDeliveries(iduser, []);
            await service.updatePlan(iduser, false);
            res.status(200).send({ msj: "se cancelo todo" });

            break;

          default:
            break;
        }
      } catch (error) {
        res.status(404).send({ msj: "Error" });
        service.close();
      }

      break;
    default:
      res.status(404).send({ result: "no entendi tu peticion" });
      service.close();
      break;
  }
}
