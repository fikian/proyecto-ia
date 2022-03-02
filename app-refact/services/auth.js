let bcrypt = require("bcryptjs");

export class Auth {
  async validate(data, session) {
    try {
      if (session.email === data.email) {
        let res = bcrypt.compareSync(session.password, data.password);
        return res;
      } else {
        return false;
      }
    } catch (error) {
      console.log("ErrorAuth" + error);
    }
  }
  async getDate(data) {
    delete data.password;
    return data;
  }
}
