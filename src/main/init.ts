import dotenv from "dotenv";
dotenv.config();
import minimist from "minimist";
import createDebug from "debug";
import { logger } from "../logger";

export const debug = createDebug("supo");

export const argv = minimist(process.argv.slice(2));
export let isDebug = false;
if (argv.d || argv.debug) {
  isDebug = true;
  debug.enabled = true
}
debug("starting supo with arguments:", argv);
logger.info("starting supo with arguments:", argv);
