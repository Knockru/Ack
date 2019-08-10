import { Context } from "@azure/functions";
import { EnvironmentCredential } from "@azure/identity";
import LookEnv, { AzureIdentity } from "@mikazuki/lookenv";
import * as got from "got";

import { EXCHANGES } from "./exchanges";
import { IExchange, Limit } from "./exchanges/exchange";
import { tryParseInt } from "./utils";
import { Variables } from "./types";

export async function fetchExchange(env: LookEnv<Variables>): Promise<IExchange> {
  const exchange = await env.get("ACK_EXCHANGE");
  return EXCHANGES.filter(w => w.id === exchange)[0];
}

export async function verifyVariables(env: LookEnv<Variables>): Promise<boolean> {
  if (!(await env.has("ACK_EXCHANGE", "ACK_ORDER_AMOUNT", "ACK_ORDER_TICKERS"))) {
    return false;
  }

  const exchangeId = await env.get("ACK_EXCHANGE");
  if (EXCHANGES.every(w => w.id != exchangeId)) return false;

  if (!tryParseInt(await env.get("ACK_ORDER_AMOUNT")).isSuccess) return false;

  const exchange = await fetchExchange(env);
  if ((await env.get("ACK_ORDER_TICKERS")).split(",").some(w => !exchange.tickers.includes(w))) return false;

  const variables = exchange.variables.map(w => `ACK_${exchange.id.toUpperCase()}_${w}`);
  if (!(await env.has(variables as any))) return false;

  return true;
}

}

export async function notify(message: string): Promise<void> {
  const content = { username: "Ack", text: message };
  await got.post(process.env.ACK_SLACK_NOTIFICATION_URL, { body: JSON.stringify(content) });
}

export function calcOrder(amount: number, ask: number, limit: Limit): number {
  const digit = 1 / limit.min;
  const order = Math.floor((amount / ask) * digit) / digit;
  return order >= limit.max ? limit.max : order;
}

export async function run(context: Context, timer: any): Promise<void> {
  if (timer.IsPastDue) return;

  const azure = new AzureIdentity(process.env.ACK_AZURE_KEY_VAULT_NAME, new EnvironmentCredential());
  const env = new LookEnv<Variables>(azure);

  const isVerified = verifyVariables(env);
  if (!isVerified) {
    console.error("Environment variables checks failed. Please check your configurations");
    return;
  }

  const exchange = await fetchExchange(env);
  await exchange.initialize(env);

  // fetch current balances
  const amounts = parseInt(await env.get("ACK_ORDER_AMOUNT"));
  const symbols = (await env.get("ACK_ORDER_TICKERS")).split(",");
  const balance = await exchange.fetchBalance();
  if (balance["JPY"] <= (amounts + amounts * 0.1) * symbols.length) {
    await notify(`WARNING: Current JPY balance is lower than \`amounts * symbols\`, please check your JPY balance on ${exchange.name}.`);
    return;
  }

  // calculate order amounts from current pricing and making a market order
  const tickers = await exchange.fetchTickers();
  for (let symbol of symbols) {
    const limit = exchange.limits[symbol];
    const order = calcOrder(amounts, tickers[symbol].ask, exchange.limits[symbol]);
    if (order < limit.min) {
      await notify(`SKIPPED: Could not place an order with the current ${symbol} price: ${tickers[symbol].ask}.`);
      continue;
    }

    await exchange.makeBuyMarketOrder(symbol, order);
    await notify(`ORDERD: Placed a marked order for ${symbol} at ${order}${symbol}.`);
  }
}

export default run;
