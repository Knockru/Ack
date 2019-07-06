export type Balance = {
  [key: string]: number;
};

export interface IExchange {
  id: string;
  name: string;
  tickers: string[];
  variables: string[];

  initialize(): void;
  fetchBalance(): Promise<Balance>;
}
