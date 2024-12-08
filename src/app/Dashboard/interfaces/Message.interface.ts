export interface Message {
  id:           number;
  fechaEntrada: string;
  campaña:      string;
  numero:       string;
  mensaje:      string;
  IdMensaje:    number;
  ID_UNICO?: number;
}

export interface AuthResponse {
  token: string
}

export interface ResHistoryMessages {
  totalMessages : number,
  pageSize : number,
  currentPage : number,
  totalPages : number,
  data : Message[]
}
