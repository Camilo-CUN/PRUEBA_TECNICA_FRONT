
export interface Login {
  username: string;
  password: string;
}
export interface User {
  user:   string;
  rol:    string;
  estado: string;
  token:  string;
}


export interface LoginResponse {
  user:   string;
  rol:    string;
  estado: string;
  token:  string;
}

export interface LoginOrganigramaRes{
  token: string;
}
