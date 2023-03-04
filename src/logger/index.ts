import pino from "pino";
const childProcess = require("child_process");
const stream = require("stream");
import { appLogPath, appName } from "../constants";

const cwd = process.cwd();
const { env } = process;
const logPath = appLogPath;

const logThrough = new stream.PassThrough();
export const logger = pino({ name: appName }, logThrough);
const child = childProcess.spawn(
  process.execPath,
  [
    require.resolve("pino-tee"),
    "warn",
    `${logPath}/warn.log`,
    "error",
    `${logPath}/error.log`,
    "fatal",
    `${logPath}/fatal.log`,
  ],
  { cwd, env, stdio: ["pipe", "inherit", "inherit"] }
);
logThrough.pipe(child.stdin);
