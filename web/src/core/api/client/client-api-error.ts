export class ClientApiError extends Error {
  status: number;
  code: string;
  payload?: unknown;
  details?: unknown;

  constructor(params: {
    message: string;
    status: number;
    code: string;
    payload?: unknown;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "ClientApiError";
    this.status = params.status;
    this.code = params.code;
    this.payload = params.payload;
    this.details = params.details;
  }
}
