import LookEnv from "@mikazuki/lookenv";
import { KeyValuePair, Variables } from "../types";

export type Balance = KeyValuePair<number>;

export type Limit = {
  max: number;
  min: number;
};

export type Order = {
  price: number;
  size: number;
};

export type OrderLimit = KeyValuePair<Limit>;

export type Ticker = {
  ask: number;
  bid: number;
};

export type Tickers = KeyValuePair<Ticker>;

export interface IExchange {
  id: string;
  name: string;
  limits: OrderLimit;
  tickers: string[];
  variables: string[];

  initialize(env: LookEnv<Variables>): Promise<void>;
  fetchBalance(): Promise<Balance>;
  fetchTickers(): Promise<Tickers>;
  makeBuyMarketOrder(symbol: string, size: number): Promise<Order>;
}
