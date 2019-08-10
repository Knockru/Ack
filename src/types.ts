export type Variables =
  | "ACK_AZURE_KEY_VAULT_NAME"
  | "ACK_EXCHANGE"
  | "ACK_ORDER_AMOUNT"
  | "ACK_ORDER_TICKERS"
  | "ACK_SLACK_NOTIFICATION_URL"
  | "ACK_COINZ_API_KEY"
  | "ACK_COINZ_API_SECRET";

export type KeyValuePair<V> = {
  [key: string]: V;
};
