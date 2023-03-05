import colors from "colors";
import fse, { appendFileSync } from "fs-extra";
import path from "path";
import os from "os";
import { appConfigPath, appLogPath, supportLangList } from "../../constants/index";

function ensureHomeDirectory() {
  fse.ensureDirSync(appLogPath);
}
ensureHomeDirectory();

function formatLang(lang: string) {
  let retLang = "";
  for (let sl of supportLangList) {
    if (new RegExp(sl, "gim").test(lang)) {
      retLang = sl;
    }
  }
  return retLang;
}
export const setLang = (lang: string) => {
  const destEnvPath = path.resolve(appConfigPath, ".env");
  const formattedLang = formatLang(lang);
  if (!formattedLang) {
    console.log(colors.red("[Error]: not support this language!\n"));
    console.log(colors.green(`Only support ${supportLangList.join(",")}`));
    process.exit(1);
  }
  const content = `${os.EOL}CHATY_LANG=${formattedLang}${os.EOL}`;
  appendFileSync(destEnvPath, content, "utf-8");
  console.log(colors.green("set language succeed!\n"));
  process.exit(0);
};
