import mongoose from "mongoose";
import { User } from "../schemas/userSchema";
import { Delivery } from "../schemas/deliverySchema";
import { ListDelyveries } from "../schemas/listDelyveries";

const { MONGO_URI } = process.env;

export class MongoDBService {
  constructor() {
    this.connect();
  }
  async connect() {
    try {
      await mongoose.connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    } catch (error) {
      console.log(error);
    }
  }
  close() {
    mongoose.models = {};
    mongoose.modelSchemas = {};
    mongoose.connection.close();
  }
  async register(form, idUser) {
    try {
      const userNew = new User({ ...form, ...idUser });
      const be = await User.findOne({
        email: form.email,
      });
      let result = null;
      if (be == null) {
        await userNew.save();
        result = {
          message: "El registyro fue exitoso",
          type: true,
        };
      } else {
        result = {
          message:
            "El correo con el que intentas registrarte ya esta registrado",
          type: false,
        };
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async login(form) {
    try {
      let be = null;
      be = await User.findOne({
        email: form.email,
      });
      console.log("Login-Mongo", be);
      return be;
    } catch (error) {
      console.log(error);
      return { msj: "Error L001" };
    }
  }

  async setToken(idUser, token) {
    try {
      const user = { idUser: idUser };
      const update = { token: token };
      await User.findOneAndUpdate(user, update);
    } catch (error) {
      console.log("ERROR-SET-M", error);
    }
  }
  async getInfo(token) {
    try {
      const info = await User.findOne({ token: token });
      return info;
    } catch (error) {
      console.log("ERROR_MONGO_getInfo: ", error);
    }
  }

  /* nota: modificar para qeu sea el id del repartidor y no su correo */
  async insertDelivery(delivery, user, register) {
    try {
      let result = NaN;
      const data = await User.findOne({ idUser: user });
      const newDelivery = new Delivery({ ...delivery });
      if (register) {
        const dataC = await User.findOne({ idUser: delivery.idUser });
        dataC.otw.push(newDelivery);
        await dataC.save();
      } else {
        const d = await ListDelyveries.findOne({ id: "general" });
        d.deliveries.push(newDelivery);
        await d.save();
      }
      data.route.push(newDelivery);
      result = await data.save();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  /* nota: modificar para qeu sea el id del repartidor y no su correo */
  async deleteDelivery(delivery, user) {
    try {
      console.log("delivery: ", delivery, "user: ", user);
      let result = NaN;
      const dataOld = await User.findOne({ idUser: user });
      //console.log(dataOld);
      if (delivery.idUser !== "") {
        await User.updateOne(
          { idUser: user },
          { $pull: { route: { idDelivery: delivery.idDelivery } } }
        );
        await User.updateOne(
          { idUser: delivery.idUser },
          { $pull: { otw: { idDelivery: delivery.idDelivery } } }
        );
      } else {
        await User.updateOne(
          { idUser: user },
          { $pull: { route: { idDelivery: delivery.idDelivery } } }
        );
        await ListDelyveries.updateOne(
          { id: "general" },
          { $pull: { deliveries: { idDelivery: delivery.idDelivery } } }
        );
      }
      const dataU = await User.findOne({ idUser: user });
      if (dataOld.route === dataU.route) {
        result = "Ocurrio un error al eliminar la entrega";
      } else {
        result = "Se elimino la entrega ";
      }

      return result;
    } catch (error) {
      console.log(error);
      return (result = { msj: "Error en eliminar" });
    }
  }

  async getRoute(idUser) {
    try {
      let result = NaN;
      const data = await User.findOne({ idUser: idUser });
      result = data.route;
      return result;
    } catch (error) {
      console.log(error);
      return { msj: "Error al obtener Route" };
    }
  }
  async getDicUser(idUser) {
    try {
      let result = NaN;
      const data = await User.findOne({ idUser: idUser });
      result = {
        address: data.address,
        colonia: data.colonia,
        numhouse: data.numhouse,
        postalcode: data.postalcode,
        city: data.city,
        state: data.state,
      };
      return result;
    } catch (error) {
      console.log(error);
      return { msj: "Error al obtener Route" };
    }
  }

  async getPackages(idUser) {
    try {
      let result = NaN;
      console.log(idUser);
      const data = await User.findOne({ idUser: idUser });
      result = Object.assign(data.otw ?? {}, data.received ?? {});
      return result;
    } catch (error) {
      console.log(error);
      return { msj: "Error al obtener Historial de paquetes" };
    }
  }
  /**
   *
   * @param {*} idUser Id sel usuario
   * @param {*} Route  lista de entragas en orden
   * acrualiza la lista de entregas del repartidor
   */
  async updateDeliveries(idUser, Route) {
    try {
      const user = { idUser: idUser };
      const update = { route: Route };
      await User.findOneAndUpdate(user, update);
    } catch (error) {
      console.log("ERROR-UPDATE-MONGO:" + error);
    }
  }

  async updateOTW(idUser, Delivery) {
    try {
      if (idUser !== "") {
        const user = { idUser: idUser };
        const data = await User.findOne(user);
        await User.updateOne(
          { user },
          {
            $pull: {
              otw: { idDelivery: Delivery.idDelivery },
              state: Delivery.state,
            },
          }
        );
        let index = data.otw.findIndex(
          (delivery) => delivery.idDelivery === Delivery.idDelivery
        );
        data.otw[index].state = Delivery.state;
        data.save();
      } else {
        const data = await ListDelyveries.findOne({ id: "general" });
        //console.log(data);

        let index = data.deliveries.findIndex(
          (delivery) => delivery.idDelivery === Delivery.idDelivery
        );
        await ListDelyveries.updateOne(
          { id: "general" },
          {
            $pull: {
              deliveries: {
                idDelivery: Delivery.idDelivery,
                state: Delivery.state,
              },
            },
          }
        );
        data.deliveries[index].state = Delivery.state;
        await data.save();
      }
      //console.log(data);
    } catch (error) {
      console.log("ERROR" + error);
    }
  }

  async getPlan(idUser) {
    try {
      let result = NaN;
      const data = await User.findOne({ idUser: idUser });
      let plan = data.plan;
      if (plan) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return { msj: "Error al obtener Route" };
    }
  }

  async updatePlan(idUser, newPlan) {
    try {
      const user = { idUser: idUser };
      const update = { plan: newPlan };
      const result = await User.findOneAndUpdate(user, update);
      return result;
    } catch (error) {
      console.log("ERROR-UPDATEPLAN-MONGO:" + error);
      return { msj: "Error update plan" };
    }
  }

  async getInfoPackage(idDe) {
    try {
      const data = await ListDelyveries.findOne({ id: "general" });
      let index = data.deliveries.findIndex(
        (delivery) => delivery.idDelivery === idDe
      );
      console.log(data.deliveries[index]);
      return data.deliveries[index];
    } catch (error) {
      console.log("ERROR-INVITE-MONGO:" + error);
      return "Error-GETIFO_PACKAGE";
    }
  }

  async deleteToken(idUser, token) {
    try {
      const user = { idUser: idUser };
      const update = { token: "" };
      await User.findOneAndUpdate(user, update);
      return;
    } catch (error) {
      console.log("ERROR-DELETE-MONGO:" + error);
      return "Error-DELEYE-TOKEN";
    }
  }
}
