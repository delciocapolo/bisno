import env from "@src/config/env";
import { io as SocketClient } from "socket.io-client";
import Logger from "../pino/logger";
import { mixeiroAcceptBisnoEvent } from "../socketio/listeners/mixeiro-accept-bisno.event";
import type { IConnectionUpdateEvent } from "@src/shared/events/evolution-events";

const SERVER_URL = env("EVOLUTION_SERVER_URL");
const API_KEY = env("EVOLUTION_AUTHENTICATION_API_KEY");
const evolutionSocket = SocketClient(SERVER_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 15000,
  forceNew: true,
  query: { apikey: API_KEY },
});
const evolutionApiLogger = Logger.publishTo({
  context: "evolution-api",
});

evolutionSocket.on("connect", () => {
  evolutionApiLogger.info(
    { SERVER_URL },
    "Successfully connected to Evolution API WebSocket",
  );
});

evolutionSocket.on("connect_error", (err: any) => {
  evolutionApiLogger.error({ error: err.message || err }, "Connection Error");
});

evolutionSocket.on("disconnect", (reason) => {
  evolutionApiLogger.warn({ reason }, "Disconnected:");

  if (reason === "parse error") {
    evolutionApiLogger.error(
      "Parse error detected - possible binary data or version mismatch",
    );
  }
});

const disconnectTimers = new Map<string, NodeJS.Timeout>();

evolutionSocket.on("connection.update", (payload: IConnectionUpdateEvent) => {
  const data = payload?.data;
  const state = data?.state;
  const instance = payload?.instance || "unknown";

  if (state === "open") {
    const t = disconnectTimers.get(instance);
    if (t) clearTimeout(t);
    disconnectTimers.delete(instance);
    return;
  }

  if (state === "close") {
    if (disconnectTimers.has(instance)) return;

    const timer = setTimeout(
      () => {
        disconnectTimers.delete(instance);
        // TODO: sendTelegram / sendEmail(...)
        // notificar só se ainda não voltou a open em 2–5 min
      },
      3 * 60 * 1000,
    );

    disconnectTimers.set(instance, timer);
  }
});

evolutionSocket.on("messages.update", (data: any) => {
  evolutionApiLogger.info({ data }, "messages.update received");

  const status = data?.data?.[0]?.update?.status || data?.status;
  if (status === "ERROR") {
    evolutionApiLogger.error({ data }, "Message failed to send (ERROR status)");
  }
});

evolutionSocket.on("message.error", (data: any) => {
  evolutionApiLogger.error({ data }, "Message error event");
});

evolutionSocket.on("messages.upsert", mixeiroAcceptBisnoEvent);

if (env("NODE_ENV") == "dev") {
  evolutionSocket.onAny((eventName, ...args) => {
    console.log(
      `📨 Event received: ${eventName}`,
      args.length > 0 ? args[0] : null,
    );
  });
}

export { evolutionSocket, evolutionApiLogger };
