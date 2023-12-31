const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const calculateCenterCoordinates = (
  startAngle: number,
  endAngle: number,
  radius: number
) => {
  const angle = (startAngle + endAngle) / 2;
  const x = (radius / 1.3) * Math.cos(angle);
  const y = (radius / 1.3) * Math.sin(angle);
  return { x, y };
};
export default { getRandomInt, calculateCenterCoordinates };
