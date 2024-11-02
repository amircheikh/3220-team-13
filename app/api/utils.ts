// Helper functions to validate date and integer fields for inserting into db

export const parseInteger = (value: string): number | null => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? null : parsed;
};

export const parseDate = (value: string): Date | null => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export const getApiEndpoint = () => {
  return window.location.origin;
};
