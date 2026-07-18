const USERS_KEY = "skala-auth-users-v1";
const SESSION_KEY = "skala-auth-session-v1";
const PERSISTENT_SESSION_KEY = "skala-auth-persistent-v1";

export class AuthError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "AuthError";
    this.code = code;
  }
}

const readJson = (storage, key, fallback) => {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (storage, key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    throw new AuthError("storage", "브라우저 저장소를 사용할 수 없습니다.");
  }
};

const removeStoredValue = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    // A failed removal is handled by the next guarded storage read.
  }
};

const bytesToHex = (bytes) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const createSalt = () => {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
};

const hashPassword = async (password, salt) => {
  if (!window.crypto?.subtle) {
    throw new AuthError("crypto", "현재 환경에서는 비밀번호 암호화를 지원하지 않습니다.");
  }

  const data = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
};

const getUsers = () => {
  const users = readJson(window.localStorage, USERS_KEY, []);
  return Array.isArray(users) ? users : [];
};

const publicUser = ({ passwordHash, passwordSalt, ...user }) => user;

const findUser = (userId) => {
  const normalizedId = userId.trim().toLowerCase();
  return getUsers().find((user) => user.userId.toLowerCase() === normalizedId) ?? null;
};

const buildEmail = (formData) => {
  const localPart = String(formData.get("userEmail") ?? "").trim();
  const selectedDomain = String(formData.get("emailDomain") ?? "").trim();
  const domain =
    selectedDomain === "direct"
      ? String(formData.get("emailCustomDomain") ?? "").trim()
      : selectedDomain;

  return `${localPart}@${domain}`;
};

export const registerUser = async (formData) => {
  const userId = String(formData.get("userId") ?? "").trim();

  if (findUser(userId)) {
    throw new AuthError("duplicate-user", "이미 사용 중인 아이디입니다.");
  }

  const passwordSalt = createSalt();
  const passwordHash = await hashPassword(String(formData.get("userPw") ?? ""), passwordSalt);
  const users = getUsers();
  const user = {
    userId,
    passwordHash,
    passwordSalt,
    email: buildEmail(formData),
    name: String(formData.get("userName") ?? "").trim(),
    birth: String(formData.get("userBirth") ?? ""),
    gender: String(formData.get("gender") ?? "none"),
    interests: formData.getAll("interest").map(String),
    subscription: String(formData.get("subscription") ?? ""),
    intro: String(formData.get("userIntro") ?? "").trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  writeJson(window.localStorage, USERS_KEY, users);
  return publicUser(user);
};

export const authenticateUser = async (userId, password) => {
  const user = findUser(userId);

  if (!user) {
    throw new AuthError("invalid-credentials", "아이디 또는 비밀번호를 확인해주세요.");
  }

  const passwordHash = await hashPassword(password, user.passwordSalt);
  if (passwordHash !== user.passwordHash) {
    throw new AuthError("invalid-credentials", "아이디 또는 비밀번호를 확인해주세요.");
  }

  return publicUser(user);
};

export const startSession = (userId, remember = false) => {
  const session = { userId, loggedInAt: new Date().toISOString() };

  removeStoredValue(window.sessionStorage, SESSION_KEY);
  removeStoredValue(window.localStorage, PERSISTENT_SESSION_KEY);
  writeJson(
    remember ? window.localStorage : window.sessionStorage,
    remember ? PERSISTENT_SESSION_KEY : SESSION_KEY,
    session,
  );
  window.dispatchEvent(new CustomEvent("skala:auth-change"));
};

export const getCurrentSession = () =>
  readJson(window.sessionStorage, SESSION_KEY, null) ??
  readJson(window.localStorage, PERSISTENT_SESSION_KEY, null);

export const getCurrentUser = () => {
  const session = getCurrentSession();
  const user = session?.userId ? findUser(session.userId) : null;
  return user ? publicUser(user) : null;
};

export const logout = () => {
  removeStoredValue(window.sessionStorage, SESSION_KEY);
  removeStoredValue(window.localStorage, PERSISTENT_SESSION_KEY);
  window.dispatchEvent(new CustomEvent("skala:auth-change"));
};
