import GraphVertex from "../data-structures/graph/GraphVertex";
import GraphEdge from "../data-structures/graph/GraphEdge";
import Graph from "../data-structures/graph/Graph";
import { formatText } from "../scripts/format";
export class GraphD {
  createG(map) {
    try {
      const format = new formatText();
      const graph = new Graph(false);

      let vertexs = format.getClave(map);

      /*let vertexA = new GraphVertex("A");
      let vertexB = new GraphVertex("B");
      const edgeAB = new GraphEdge(vertexA, vertexB, 5.3);
      graph.addEdge(edgeAB);*/

      var vertex = new Map();
      for (let index = 0; index < vertexs.length; index++) {
        let key = String(vertexs[index]);
        vertex.set(key, new GraphVertex(key));
      }

      //console.log(vertex);

      var edge = [];
      for (const [clave, valor] of map) {
        let point1 = String(clave).split("-");
        let x1 = point1[0];
        let x2 = point1[1];
        edge.push(
          new GraphEdge(vertex.get(x1), vertex.get(x2), parseFloat(valor[0]))
        );
      }

      for (let index = 0; index < edge.length; index++) {
        graph.addEdge(edge[index]);
      }

      return graph;
    } catch (error) {
      console.log(error);
      return { msj: "ERROR-graphD-C" };
    }
  }
}
