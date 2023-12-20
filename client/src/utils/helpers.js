export const convertCentsToEuroString = (cents) => {
  try {
    const euro = Number(cents) / 100;
    return euro.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  } catch (error) {
    return '';
  }
};
