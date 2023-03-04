import dotenv from "dotenv";
dotenv.config();
import minimist from "minimist";
import createDebug from "debug";

export const debug = createDebug("chaty");

export const argv = minimist(process.argv.slice(2));
export let isDebug = false;
if (argv.d || argv.debug || process.env.DEBUG) {
  isDebug = true;
  debug.enabled = true
}
debug("starting chaty with arguments:", argv);
