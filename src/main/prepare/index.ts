import dotenv from "dotenv";
import fse, { appendFileSync } from "fs-extra";
dotenv.config();
import { appLogPath } from "../../constants/index";

function ensureHomeDirectory() {
  fse.ensureDirSync(appLogPath);
}
ensureHomeDirectory();
