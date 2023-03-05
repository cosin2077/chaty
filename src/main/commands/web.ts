import { appConfigPath } from "./../../constants/index";
import path from "path";
import { parse as dotenvParse } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { logger } from "../../logger";
import { runChildProcess, runChildProcessSync } from "../../utils";
import { chatyDebug } from "../prepare/debug";
import { projectInstall } from "pkg-install";
const name = "web-service";
let cmd = "npm";
if (/win32|win64/.test(process.platform)) {
  cmd = "npm.cmd";
} else {
  cmd = "npm";
}

export async function runWebService() {
  console.log("runWebService...");

  const webDir = await getWebServiceDir();
  await copyEnv(appConfigPath, webDir);

  const buildArgs: string[] = ["run", "build"];
  const serveArgs: string[] = ["run", "serve"];
  const options = {
    cwd: webDir,
  };
  chatyDebug(`string to install pkgs for web-service...`);
  await projectInstall({
    cwd: webDir,
  });
  chatyDebug(`string to build for web-service...`);
  runChildProcessSync(cmd + " " + buildArgs.join(" "), options);

  chatyDebug(`string to run serve for web service...`);
  const child = runChildProcess(name, cmd, serveArgs, options);
}
async function getWebServiceDir() {
  const webPath = path.resolve(
    __dirname,
    "..",
    "..",
    "services",
    "web",
    "client"
  );
  return webPath;
}
const exposeEnv = ["OPEN_AI_KEY"];
async function copyEnv(from: string, to: string) {
  const fromEnv = path.resolve(from, ".env");
  const toEnv = path.resolve(to, ".env");
  const checkFrom = await existsSync(fromEnv);
  chatyDebug(`copy from ${fromEnv} to ${toEnv}`);
  if (!checkFrom) {
    chatyDebug(`[Error]: cannot find .env file in ${from}!`);
    logger.fatal(` .env not exists!${fromEnv}`);
    return;
  }
  const content = readFileSync(fromEnv, "utf-8");
  const parsed = dotenvParse(content);
  let newContent = "";
  for (let prop in parsed) {
    if (exposeEnv.includes(prop)) {
      newContent += `VITE_${prop}=${parsed[prop]}\n`;
    }
  }
  writeFileSync(toEnv, newContent, "utf-8");
}
