import os from "os";
import path from "path";

export const appName = "chaty";
export const appConfigDirName = ".chaty";
export const appConfigLog = ".chaty.logs";
export const appConfigPath = path.resolve(os.homedir(), appConfigDirName);
export const appLogPath = path.resolve(appConfigPath, appConfigLog);
