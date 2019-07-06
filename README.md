# Ack

Ack periodically places a fixed amount of market order on the cryptocurrency exchange.  


## Configurable Variables

| Variable                     | Description                                                                         | Example       |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------- |
| `ACK_EXCHANGE`               | Cryptocurrency Exchange ID that order is places                                     | `coinz`       |
| `ACK_ORDER_AMOUNT`           | Order amount per currency (FIAT). You need 10% of the this value to place the order | `1000`        |
| `ACK_ORDER_TICKERS`          | Type of cryptocurrencies in which the order is places                               | `BTC,ETH,XRP` |
| `ACK_${EXCHANGE_ID}_API_*`   | API keys for making API requests to exchange                                        | `*****`       |
| `ACK_SLACK_NOTIFICATION_URL` | Slack Webhook URL to send logs                                                      | `https://...` |


If you configured `ACK_ORDER_AMOUNT=1000` and `ACK_ORDER_TICKERS=BTC,ETH,XRP`, you needs `1000 * 0.1 * 3 = 3300` JPY in your JPY balance.