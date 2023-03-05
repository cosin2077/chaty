import { parse as dotenvParse } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { logger } from "../../logger";
import { runChildProcess } from "../../utils";
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

  const projectDir = await getProjectDir();
  const webDir = await getWebServiceDir();
  await copyEnv(projectDir, webDir);

  const args: string[] = ["run", "dev"];
  const options = {
    cwd: webDir,
  };
  chatyDebug(`string to install pkgs for web-service...`);
  await projectInstall({
    cwd: webDir,
  });
  chatyDebug(`string to run web service...`);
  const child = runChildProcess(name, cmd, args, options);
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
async function getProjectDir() {
  const projectPath = path.resolve(__dirname, "..", "..", "..");
  return projectPath;
}
const exposeEnv = ["OPEN_AI_KEY"];
async function copyEnv(from: string, to: string) {
  const fromEnv = path.resolve(from, ".env");
  const toEnv = path.resolve(to, ".env");
  const checkFrom = await existsSync(fromEnv);

  if (!checkFrom) {
    chatyDebug(`error: .env not exists!`);
    logger.fatal(`error: .env not exists!${fromEnv}`);
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
  chatyDebug(`copy .env file to ${toEnv} succeed!`);
}
