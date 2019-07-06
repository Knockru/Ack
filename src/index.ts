import { AzureFunction, Context } from "@azure/functions";

import { EXCHANGES } from "./exchanges";
import { IExchange } from "./exchanges/exchange";
import { tryParseInt } from "./utils";
import { KeyValuePair } from "./types";

function fetchExchange(): IExchange {
  return EXCHANGES.filter(w => w.id === process.env.ACK_EXCHANGE)[0];
}

function verifyVariables(): boolean {
  let success = true;

  // ACK_EXCHANGE is required
  success = success && (!!process.env.ACK_EXCHANGE && EXCHANGES.some(w => w.id === process.env.ACK_EXCHANGE));
  if (!success) return false;

  // ACK_ORDER_AMOUNT is required
  success = success && (!!process.env.ACK_ORDER_AMOUNT && tryParseInt(process.env.ACK_ORDER_AMOUNT).isSuccess);

  // ACK_ORDER_TICKERS is required
  const exchange = fetchExchange();
  success = success && (!!process.env.ACK_ORDER_TICKERS && process.env.ACK_ORDER_TICKERS.split(",").every(w => exchange.tickers.includes(w)));

  // ACK_${EXCHANGE_ID}_API_* is required
  success = success && exchange.variables.every(w => !!process.env[`ACK_${process.env.ACK_EXCHANGE.toUpperCase()}_${w}`]);

  return success;
}

async function notify(message: string): Promise<void> {
  console.log(message);
  // TODO: Impl
}

async function run(context: Context, timer: any): Promise<void> {
  const isVerified = verifyVariables();
  if (!isVerified) {
    console.error("Environment variables checks failed. Please check your configurations");
    return;
  }

  const exchange = fetchExchange();
  exchange.initialize();

  // fetch current balances
  const amounts = parseInt(process.env.ACK_ORDER_AMOUNT);
  const symbols = process.env.ACK_ORDER_TICKERS.split(",");
  const balance = await exchange.fetchBalance();
  if (balance["JPY"] <= (amounts + amounts * 0.1) * symbols.length) {
    await notify(`WARNING: Current JPY balance is lower than \`amounts * symbols\`, please check your JPY balance on ${exchange.name}.`);
    return;
  }

  // calculate order amounts from current pricings and making a market order
  const tickers = await exchange.fetchTickers();
  for (let symbol of symbols) {
    const limit = exchange.limits[symbol];
    const digit = 1 / limit.min;
    const order = Math.floor((amounts / tickers[symbol].ask) * digit) / digit;
    if (order < limit.min) {
      await notify(`SKIPPED: Could not place an order with the current ${symbol} price: ${tickers[symbol].ask}.`);
      continue;
    }

    await exchange.makeBuyMarketOrder(symbol, order >= limit.max ? limit.max : order);
    await notify(`ORDERD: Placed a marked order for ${symbol} at ${order >= limit.max ? limit.max : order}${symbol}.`);
  }
}

export default run;
