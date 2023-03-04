import dotenv from "dotenv";
import fse from "fs-extra";
import path from "path";
dotenv.config();
import { debug } from "./init";
import { appConfigPath, appLogPath } from "./../constants/index";

function ensureHomeDirectory() {
  fse.ensureDirSync(appLogPath);
}
ensureHomeDirectory();
if (process.env.OPEN_AI_KEY) {
  // .env in .cwd, copy to appHome
  const envFile = path.resolve(__dirname,'..','..', ".env");
  const destEnvPath = path.resolve(appConfigPath, ".env");
  console.log(envFile)
  if (fse.existsSync(envFile)) {
    fse.copySync(envFile, destEnvPath, { overwrite: true });
    debug('copy .env to home dir succeed!')
  }
} else {
  debug("OPEN_AI_KEY needed!");
  process.exit(1);
}
