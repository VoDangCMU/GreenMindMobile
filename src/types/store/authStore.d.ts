declare interface IUser {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  gender?: string;
  location?: string;
}

declare interface IToken {
  access_token: string;
  refresh_token: string;
}

declare interface IAuthState {
  user: IUser | null;
  tokens: IToken | null;
  isAuthenticated: boolean;
  bypassAuthGate: boolean;

  setUser: (user: IUser) => void;
  setTokens: (tokens: IToken) => void;
  clearAuth: () => void;
  setBypassAuthGate: (value: boolean) => void;
}