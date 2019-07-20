declare namespace NodeJS {
  interface ProcessEnv {
    ACK_EXCHANGE: "coinz";
    ACK_ORDER_AMOUNT: string;
    ACK_ORDER_TICKERS: string;
    ACK_COINZ_API_KEY: string;
    ACK_COINZ_API_SECRET: string;
    ACK_SLACK_NOTIFICATION_URL: string;
  }
}
