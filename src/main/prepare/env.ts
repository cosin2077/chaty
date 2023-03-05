import { runtimeParams, supportLangList } from "./../../constants/index";
import dotenv from "dotenv";
import path from "path";
import { appConfigPath } from "../../constants/index";
dotenv.config({ path: path.resolve(appConfigPath, ".env") });

if (
  process.env.CHATY_LANG &&
  supportLangList.includes(process.env.CHATY_LANG)
) {
  runtimeParams.setVar("CHATY_LANG", process.env.CHATY_LANG);
}
/**
 * OPEN_AI_KEY
 * CHATY_LANG
 * ...
 */
