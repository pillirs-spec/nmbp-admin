import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
  query: any;
  params: any;
  plainToken?: PlainToken;
}

interface PlainToken {
    user_id: number;
    role_id: number;
    email_id: number;
    devoteeId: string;
    level: string;
}
