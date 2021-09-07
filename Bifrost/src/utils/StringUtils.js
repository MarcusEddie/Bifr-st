export function isBlank(val) {
  if ((typeof val === "undefined" || val === null || val.toString().trim() === "")) {
    return true;
  }
  return false;
}

export function isNotBlank(val) {
  const rs = isBlank(val);
  return !rs;
}