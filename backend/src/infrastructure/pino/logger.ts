import * as path from "node:path";
import * as fs from "node:fs";
import P from "pino";
import { formatInTimeZone } from "date-fns-tz";
import type { AbstractLogger } from "../../shared/@types/logger.js";
import env from "@src/config/env.js";

type ILoggerLevelType =
  "info" | "error" | "silent" | "debug" | "fatal" | "warn" | "trace";

const destinationCache = new Map<string, P.Logger>();

function getOrCreateLogger(destinationName: string): P.Logger {
  const cached = destinationCache.get(destinationName);
  if (cached) return cached;

  const logFile = path.resolve(
    process.cwd(),
    "src",
    "storage",
    "logs",
    `${destinationName}.log`,
  );
  fs.mkdirSync(path.dirname(logFile), { recursive: true });

  const instance = P(
    {
      timestamp: () =>
        `,"timestamp":"${formatInTimeZone(new Date(), env("TIMEZONE"), "yyyy-MM-dd HH:mm:ss")}"`,
    },
    P.destination({ dest: logFile, sync: true }),
  );

  destinationCache.set(destinationName, instance);
  return instance;
}

export class LoggerService implements AbstractLogger {
  constructor(private readonly scope?: string) {}

  private resolveDestinationName(level: ILoggerLevelType): string {
    return this.scope || level;
  }

  private log(level: ILoggerLevelType, ...params: any[]): void {
    const destinationName = this.resolveDestinationName(level);
    const logger = getOrCreateLogger(destinationName);
    (logger[level] as (...args: any[]) => void)(...params);
  }

  publishTo({ context }: { context: string }): LoggerService {
    return new LoggerService(context);
  }

  info(message?: string, ...args: any[]): void;
  info(error: object, message?: string, ...args: any[]): void;
  info(...params: any[]): void {
    this.log("info", ...params);
  }

  error(message?: string, ...args: any[]): void;
  error(error: object, message?: string, ...args: any[]): void;
  error(...params: any[]): void {
    this.log("error", ...params);
  }

  silent(...params: any[]): void {
    this.log("silent", ...params);
  }
  debug(...params: any[]): void {
    this.log("debug", ...params);
  }
  fatal(...params: any[]): void {
    this.log("fatal", ...params);
  }
  warn(...params: any[]): void {
    this.log("warn", ...params);
  }
  trace(...params: any[]): void {
    this.log("trace", ...params);
  }
}

const Logger = new LoggerService();
export default Logger;
