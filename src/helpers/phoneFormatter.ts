
interface IPhoneFormatterData {
    cleanedValue: string,
    formattedValue: string,
    isValid: boolean,
}

export const phoneFormatter = (text: string | undefined): IPhoneFormatterData => {
  if (!text) {
    return {
      cleanedValue: '',
      formattedValue: '',
      isValid: false,
    };
  }
  const cleaned = text?.replace(/\D/g, '');

  let formatted = '';

  if (cleaned.length === 1) {formatted = `+7 (${cleaned.substring(2, 4)}`;}
  if (cleaned.length > 1) {formatted = `+7 (9${cleaned.substring(2, 4)}`;}
  if (cleaned.length >= 4) {formatted += `) ${cleaned.substring(4, 7)}`;}
  if (cleaned.length >= 7) {formatted += `-${cleaned.substring(7, 9)}`;}
  if (cleaned.length >= 9) {formatted += `-${cleaned.substring(9, 11)}`;}

  return {
    cleanedValue: cleaned,
    formattedValue: formatted.replace(/\D+$/, ''),
    isValid: cleaned.length === 11,
  };
};
