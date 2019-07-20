# Ack

![GitHub](https://img.shields.io/github/license/Knockru/Ack.svg?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/Knockru/Ack.svg?style=flat-square)

Ack periodically places a fixed amount of market order on the cryptocurrency exchange.

## Information

| Key      | Value                          |
| -------- | ------------------------------ |
| Trigger  | Timer                          |
| Schedule | 03:00 (GMT) on day-of-month 10 |

## Configurable Variables

| Variable                     | Description                                                        | Example       |
| ---------------------------- | ------------------------------------------------------------------ | ------------- |
| `ACK_EXCHANGE`               | Cryptocurrency Exchange ID that order is places                    | `coinz`       |
| `ACK_ORDER_AMOUNT`           | Order amount (FIAT). You need additional 10% balance of this value | `1000`        |
| `ACK_ORDER_TICKERS`          | Type of cryptocurrencies in which the order is places              | `BTC,ETH,XRP` |
| `ACK_${EXCHANGE_ID}_API_*`   | API keys for making API requests to exchange                       | `*****`       |
| `ACK_SLACK_NOTIFICATION_URL` | Slack Webhook URL to send logs                                     | `https://...` |

If you configured `ACK_ORDER_AMOUNT=1000` and `ACK_ORDER_TICKERS=BTC,ETH,XRP`, you needs `1000 * 0.1 * 3 = 3300` JPY in your JPY balance.
