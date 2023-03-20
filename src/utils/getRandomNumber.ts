export const getRandomNumber = (min: string, max: string) => {
  const MIN = isNaN(Number(min)) ? 60 * 1000 : Number(min) * 1000 * 60;
  const MAX = isNaN(Number(max)) ? 60 * 1000 : Number(max) * 1000 * 60;
  let random = Math.floor(Math.random() * (MAX - MIN) + MIN);
  return random;
};
