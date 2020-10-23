export function inspect(target) {
  switch (typeof target) {
    case "number":
      return 0;
    case "string":
      return 1;
    case "boolean":
      return 2;
    case "object":
      if (target === null) {
        return 3;
      } else if (Array.isArray(target)) {
        return 4;
      } else if (target instanceof Date) {
        return 5;
      } else if (target instanceof Set) {
        return 6;
      } else if (target instanceof Map) {
        return 7;
      } else {
        return 8;
      }
    default:
      break;
  }
}
