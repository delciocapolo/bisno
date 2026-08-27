import crypto from "crypto";

export function generateOTP(length = 4) {
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (num) => num % 10).join("");
}

export function getExpirationTime(minutes = 5) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutes);
  return now;
}
