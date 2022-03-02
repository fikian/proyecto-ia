const { MAPS_URI, API_KEY_DISTANCE } = process.env;
export class MapsService {
  async getInfo(POINT_ORIGIN, POINT_DES) {
    try {
      const result = await fetch(
        MAPS_URI +
          POINT_ORIGIN +
          "&destinations=" +
          POINT_DES +
          API_KEY_DISTANCE
      ).then((res) => res.json());
      return result;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
