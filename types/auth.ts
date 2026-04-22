export type AuthMode = "login" | "register";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  username: string;
};

export type AuthSuccessResponse = {
  access_token: string;
  message?: string;
};
