import { route } from "next/dist/next-server/server/router";

export class formatText {
  /**
   *
   * @param {*} data : es la direccion del formulario de envio
   * @returns devuleve la direcion en formato para utilizar en maps
   */
  createDirection(data) {
    let dir =
      this.normalizeString(data.address, true) +
      "+" +
      (data.numhouse ?? "") +
      "+" +
      this.normalizeString(data.colonia, true) +
      "+" +
      data.postalcode +
      "+" +
      this.normalizeString(data.city, true) +
      "+" +
      this.normalizeString(data.state, true);
    return dir;
  }
  cleanString(string) {
    let res = "";
    res = string.replace(/[++]{2}/g, "+");
    return res;
  }
  /**
   *  remplaza la los espacios por un +, quita los signos de acentuacion
   * @param {*} string recibe una direccion y le formatea
   * quita signos de puntuacion y acentos
   * quita espacios al inicio y final
   *
   * @returns devuelve al direcion concatenada por +
   */
  normalizeString(string, option) {
    let res = NaN;
    res = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    res = res.trim();
    res = res.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()”“"…]/g, "");
    if (option) {
      res = res.replace(/\s/g, "+");
    }
    return res.toLocaleLowerCase();
  }
  /**
   *
   * @param {*} data : es la informacion del formulario de entrega
   * @returns devuelve el id de la entrega
   */
  createID(data) {
    let str = this.randStr();
    let id =
      data.username.substr(0, 2) +
      data.lastname.substr(0, 2) +
      "-" +
      this.initaddress(data.address) +
      (data.numhouse ?? "") +
      "-" +
      str;
    return id.toLocaleUpperCase();
  }

  /**
   *
   * @param {*} data es la informacion del formulario de registro
   * @returns  el idi del usuario
   */

  createIDUser(data) {
    let str = this.randStr();
    let num = "";
    if (data.numhouse != NaN) {
      num = data.numhouse;
    } else {
      num = this.numrand;
    }
    //console.log(this.initaddress(data.address));
    let id =
      data.username.substr(0, 2) +
      data.lastname.substr(0, 2) +
      this.initaddress(data.address) +
      num +
      str;
    return { idUser: id.toLocaleUpperCase() };
  }

  /**
   *
   * @param {*} data : informacion de la entrega por maps
   * @param {*} id id del delivery
   * @param {*} User informacion del cliente
   * @param {*} iduser id del cliente
   * @returns
   */
  createDelivery(data, id, User) {
    let result = NaN;
    result = {
      idDelivery: id,
      idUser: User.idUser,
      destination_addresses: data.destination_addresses[0],
      username: User.username,
      lastname: User.lastname,
      state: "",
      distance: data.rows[0].elements[0].distance.text,
      order: "",
      duration: data.rows[0].elements[0].duration.text,
    };
    return result;
  }

  /**
   *
   * @returns Devuelve un randon de longitud 4
   */
  numrand() {
    let chars = "0123456789";
    let str = "";
    for (let i = 0; i < 4; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }

  /**
   *
   * @returns devuelve un random de logitud 4 son numeros y letras
   */
  randStr() {
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < 4; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
  }

  initaddress(string) {
    let ad = NaN;
    let res = "";
    ad = this.normalizeString(string, false);
    ad = ad.replace(/av|y|de|calz|blvrd|calle|san|don/g, "");
    ad = ad.trim();
    let aux = ad.split(" ");
    res = this.str2(aux);
    return res;
  }
  /**
   *
   * @param {*} aux  arrglo de str
   * @returns devuelve un str de logitud 2
   */
  str2(aux) {
    let res = "";
    if (aux.length >= 2) {
      for (let i = 0; i < aux.length; i++) {
        if (aux[i].length > 2) {
          res += aux[i].substr(0, 1);
        }
      }
    } else {
      for (let i = 0; i < aux.length; i++) {
        if (aux[i].length > 2) {
          res += aux[i].substr(0, 2);
        }
      }
    }
    return res.substr(0, 2);
  }

  createTable(origen, route) {
    let table = new Map();
    let position = 1;
    for (let index = 0; index < route.length; index++) {
      table.set(
        origen +
          "-" +
          this.normalizeString(route[index].destination_addresses, true),
        [
          route[index].distance,
          route[index].duration,
          route[index].destination_addresses,
        ]
      );
    }
    for (let index = 0; index < route.length; index++) {
      if (index < route.length) {
        for (let i = position; i < route.length; i++) {
          table.set(
            this.normalizeString(route[index].destination_addresses, true) +
              "-" +
              this.normalizeString(route[i].destination_addresses, true),
            ["", "", route[index].destination_addresses]
          );
        }
        position += 1;
      } else {
        break;
      }
    }
    return table;
  }

  getClave(map) {
    let auxP1 = "";
    let list = [];
    for (const [clave, _] of map) {
      let point = String(clave).split("-");
      list.push(point[0]);
      auxP1 = point[0];
      break;
    }

    for (let [clave, _] of map) {
      let point = String(clave).split("-");
      if (auxP1 == point[0]) {
        list.push(point[1]);
      } else {
        break;
      }
    }
    return list;
  }

  createOrden(orden, map, route) {
    let arrayOrden = orden.split(",");
    let auxMap = new Map();
    let newRoute = [];
    for (let index = 0; index < arrayOrden.length; index++) {
      if (index < arrayOrden.length - 1) {
        let info = map.get(arrayOrden[index] + "-" + arrayOrden[index + 1]);
        if (
          map.get(arrayOrden[index] + "-" + arrayOrden[index + 1]) != undefined
        ) {
          info.pop();
          auxMap.set(arrayOrden[index] + "-" + arrayOrden[index + 1], info);
        } else {
          let auxInfo = map.get(
            arrayOrden[index + 1] + "-" + arrayOrden[index]
          );
          auxMap.set(
            arrayOrden[index] + "-" + arrayOrden[index + 1],
            this.deleteitem(auxInfo)
          );
        }
      } else {
        break;
      }
    }
    for (const [clave, valor] of auxMap) {
      let addressDes = valor[2];
      for (let index = 0; index < route.length; index++) {
        if (addressDes === route[index].destination_addresses) {
          let delivery = route[index];
          delivery.distance = valor[0];
          delivery.duration = valor[1];
          delivery.state = "En camino";
          newRoute.push(delivery);
        }
      }
    }

    //console.log(newRoute);
    return newRoute;
  }
  /**
   *
   * @param {*} array es el arreglo al cual se le va a eliminar un elemteno
   * @returns un array sin el 2 elemento, modificar para que sea la n posicion
   */
  deleteitem(array) {
    let aux = [];
    let head = array.splice(0, 2);
    let res = array.splice(1, 2);

    aux = head.concat(res);
    return aux;
  }

  getInfo(data) {
    let duration = 0;
    let distance = 0;
    for (let index = 0; index < data.length; index++) {
      let auxDuration = data[index].duration;
      let auxDistance = data[index].distance;
      duration += parseInt(auxDuration);
      distance += parseFloat(auxDistance);
    }

    return {
      dur: duration.toFixed(0).toString() + " min",
      dis: distance.toFixed(1).toString() + " km",
    };
  }

  cretalistTable(data) {
    let list = [];
    for (let index = 0; index < data.length; index++) {
      let aux = {
        key: (index + 1).toString(),
        package: data[index].idDelivery,
        state: data[index].state
          ? data[index].state
          : "Aun no se ha despachado",
        date: data[index].date ? data[index].date : "",
      };
      list.push(aux);
    }
    return list;
  }

  infoUser(data) {
    let res = {
      plan: data.plan,
      username: data.username,
      lastname: data.lastname,
      address: data.address,
      colonia: data.colonia,
      numhouse: data.numhouse,
      postalcode: data.postalcode,
      route: data.route,
      city: data.city,
      state: data.state,
      idUser: data.idUser,
    };
    return res;
  }
}
