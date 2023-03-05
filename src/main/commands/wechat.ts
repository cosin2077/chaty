import { appConfigPath } from "../../constants/index";
import path from "path";
import { parse as dotenvParse } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { logger } from "../../logger";
import { runChildProcess } from "../../utils";
import { chatyDebug } from "../prepare/debug";
import { projectInstall } from "pkg-install";
const name = "web-service";
let cmd = "node";
if (/win32|win64/.test(process.platform)) {
  cmd = "node.cmd";
} else {
  cmd = "node";
}

export async function runWechatService() {
  console.log("runWechatService...");

  const webDir = await getWechatServiceDir();
  await copyEnv(appConfigPath, webDir);

  const args: string[] = ["index"];
  const options = {
    cwd: webDir,
  };
  chatyDebug(`string to install pkgs for wechat service...`);
  await projectInstall({
    cwd: webDir,
  });
  chatyDebug(`string to run wechat service...`);
  const child = runChildProcess(name, cmd, args, options);
}
async function getWechatServiceDir() {
  const webPath = path.resolve(
    __dirname,
    "..",
    "..",
    '..',
    'lib',
    "services",
    "wechat",
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
