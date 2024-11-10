export const age = (date: Date | string) => {
  const now = new Date();
  const birthDate = new Date(date);
  const diff = now.getTime() - birthDate.getTime();
  const age = new Date(diff);

  return Math.abs(age.getUTCFullYear() - 1970);
};
