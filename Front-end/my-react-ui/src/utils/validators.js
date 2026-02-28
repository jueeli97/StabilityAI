export function isRequired(v){
  return v !== null && v !== undefined && String(v).trim() !== "";
}

export function toNumberOrNaN(v){
  if (v === "" || v === null || v === undefined) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export function isNonNegative(n){
  return Number.isFinite(n) && n >= 0;
}

export function isIntNonNegative(n){
  return Number.isInteger(n) && n >= 0;
}