export type Balance = {
  [key: string]: number;
};

export interface IExchange {
  id: string;
  tickers: string[];
  variables: string[];

  initialize(): void;
  fetchBalance(): Promise<Balance>;
}
