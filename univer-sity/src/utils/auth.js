import Cookies from "js-cookie";

const TokenKey = "token";
const UserIdKey = "userId";

export function getToken() {
  return Cookies.get(TokenKey);
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}
export function setUserId(userId) {
  return Cookies.set(UserIdKey, userId);
}
export function getUserId() {
  return Cookies.get(UserIdKey);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
