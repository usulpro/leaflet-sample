const ZOOM_LEVELS = [
  {
    level: 5,
    minDist: Math.pow(1.1697, 2),
  },
];

const squareDistance = (A, B) => {
  return (
    Math.pow(A.coords[0] - B.coords[0], 2) +
    Math.pow(A.coords[1] - B.coords[1], 2)
  );
};

export const distMatrix = markers => {
  const shallowCopy = markers.slice();
  const matrix = markers.map((mrk, indA) => {
    const A = shallowCopy.splice(0, 1)[0];
    const distances = shallowCopy.map((m, j) => ({
      dist: squareDistance(A, m),
      A: mrk,
      B: m,
    }));
    return distances;
  });
  console.log(matrix);
  const flatMatrix = [];
  matrix.forEach(matr => flatMatrix.push(...matr));

  console.log('​flatMatrix', flatMatrix);
  return flatMatrix;

};

const findZoomLevels = flatMatrix => {
  ZOOM_LEVELS.forEach(({ level, minDist }) => {
    const collapsed = flatMatrix.filter(({dist}) => dist < minDist);
    collapsed.forEach(({A, B}) => {
      A.zooms = A.zooms || [];
      B.zooms = B.zooms || [];
      const zoomsLvlA = A.zooms.find(z => z.minLvl === level);
      if (zoomsLvlA) {
        zoomsLvlA.cluster.push(B);
        return
      } else {
        A.zooms.push({minLvl: level, cluster: [B]})
      }
      const zoomsLvlB = B.zooms.find(z => z.minLvl === level);
      if (!zoomsLvlB) {
        B.zooms.push({minLvl: level})
      }
    })
  });
};

export const processData = markers => {
  const flatMatrix = distMatrix(markers);
  findZoomLevels(flatMatrix);
  console.log('​markers', markers);
};
