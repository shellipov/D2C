export function stringCapitalize (str: string): string {
  return (str?.length || 0) > 0 ? str[0].toUpperCase() + str.slice(1) : str;
}
