// coin.z thin API wrapper for TypeScript

import { createHmac } from "crypto";
import * as got from "got";

const COINZ_HOST = "https://api.coin.z.com";

interface IResponse<T> {
  status: number;
  data: T;
  responseTime: Date;
}

export class Coinz {
  public constructor(private key: string, private secret: string) { }

  public async get<T>(path: string): Promise<IResponse<T>> {
    const headers = this.createHeaders("GET", path);
    const response = await got.get(path, { baseUrl: COINZ_HOST, headers });
    return JSON.parse(response.body) as IResponse<T>;
  }

  public async post<T>(path: string, body: any = null): Promise<IResponse<T>> {
    const headers = this.createHeaders("POST", path, body);
    const response = await got.post(path, { baseUrl: COINZ_HOST, headers, body });
    return JSON.parse(response.body) as IResponse<T>;
  }

  private createHeaders(method: string, path: string, body: any = null): { [key: string]: string } {
    if (this.key === null || this.key === "" || !path.includes("private")) {
      return {}; // empty headers
    }

    const timestamp = Date.now().toString();
    const message = `${timestamp}${method}${path.substring("/private".length)}${(body ? JSON.stringify(body) : "")}`;
    const sign = createHmac("sha256", this.secret).update(message).digest("hex");

    return {
      "API-KEY": this.key,
      "API-TIMESTAMP": timestamp,
      "API-SIGN": sign
    };
  }
}