import os from "os";
import path from "path";

export const appName = "supo";
export const appConfigDirName = ".supo";
export const appConfigLog = ".supo.logs";
export const appConfigPath = path.resolve(os.homedir(), appConfigDirName);
export const appLogPath = path.resolve(appConfigPath, appConfigLog);
