declare interface ILoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

declare interface ILoginResponse {
  message: string;
  user: IUser;
  access_token: string;
  refresh_token: string;
}