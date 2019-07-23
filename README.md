# Ack

![GitHub](https://img.shields.io/github/license/Knockru/Ack.svg?style=flat-square)
![CircleCI](https://img.shields.io/circleci/build/github/Knockru/Ack.svg?style=flat-square)

Ack periodically places a fixed amount of market order on the cryptocurrency exchange.

## Information

| Key      | Value                          |
| -------- | ------------------------------ |
| Trigger  | Timer                          |
| Schedule | 03:00 (GMT) on day-of-month 10 |

## Environment Variables

| Variable                     | Description                                                        | Example       |
| ---------------------------- | ------------------------------------------------------------------ | ------------- |
| `ACK_AZURE_KEY_VAULT_NAME`   | Azure Key Vault Container Name                                     | `container`   |
| `ACK_EXCHANGE`               | Cryptocurrency Exchange ID that order is places                    | `coinz`       |
| `ACK_ORDER_AMOUNT`           | Order amount (FIAT). You need additional 10% balance of this value | `1000`        |
| `ACK_ORDER_TICKERS`          | Type of cryptocurrencies in which the order is places              | `BTC,ETH,XRP` |
| `ACK_SLACK_NOTIFICATION_URL` | Slack Webhook URL to send logs                                     | `https://...` |
| `AZURE_CLIENT_ID`            | Azure AD Application Client ID                                     | `xxxxxx-...`  |
| `AZURE_CLIENT_SECRET`        | Azure AD Application Secret                                        | `xxxxxx`      |
| `AZURE_TENANT_ID`            | Azure AD Tenant ID                                                 | `xxxxxx-...`  |

## Key Vault Secrets

| Secret              | Description          |
| ------------------- | -------------------- |
| `AckCoinzApiKey`    | GMO CoinZ API Key    |
| `AckCoinzApiSecret` | GMO CoinZ API Secret |
