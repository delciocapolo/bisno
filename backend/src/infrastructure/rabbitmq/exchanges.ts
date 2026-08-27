export const EXCHANGES = {
  topic: { name: "bisno.exchange.topic", type: "topic" as const },
  direct: { name: "bisno.exchange.direct", type: "direct" as const },
  dlx: { name: "bisno.exchange.dlx", type: "direct" as const },
} as const;

export type ExchangeKey = keyof typeof EXCHANGES;
