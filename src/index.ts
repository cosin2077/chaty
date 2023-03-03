import dotenv from "dotenv";
dotenv.config();
import minimist from "minimist";
import createDebug from "debug";

const debug = createDebug('supo')
const argv = minimist(process.argv.slice(2));
debug('starting supo with arguments:', argv);
