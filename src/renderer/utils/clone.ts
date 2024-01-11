/* eslint-disable import/prefer-default-export */
export function deepClone<T>(obj: T) {
  return JSON.parse(JSON.stringify(obj));
}
