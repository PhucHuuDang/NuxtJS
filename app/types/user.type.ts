export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "other"; // can be extended if API supports more
  image: string;
  accessToken: string;
  refreshToken: string;
}
