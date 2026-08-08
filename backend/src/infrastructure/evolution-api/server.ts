import env from "@src/config/env";
import { io as SocketClient } from "socket.io-client";
import Logger from "../pino/logger";
import { mixeiroAcceptBisnoEvent } from "../socketio/listeners/mixeiro-accept-bisno.event";

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

  // Log more details on parse error
  if (reason === "parse error") {
    evolutionApiLogger.error(
      "Parse error detected - possible binary data or version mismatch",
    );
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

if (env("NODE_ENV") == "development") {
  evolutionSocket.onAny((eventName, ...args) => {
    console.log(
      `📨 Event received: ${eventName}`,
      args.length > 0 ? args[0] : null,
    );
  });
}

export { evolutionSocket, evolutionApiLogger };
