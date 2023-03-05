import colors from "colors";
import fse, { appendFileSync } from "fs-extra";
import path from "path";
import os from "os";
import { debug } from "../init";
import { appConfigPath } from "../../constants/index";


export const runLogin = (key: string) => {
  const destEnvPath = path.resolve(appConfigPath, ".env");
  if (key || process.env.OPEN_AI_KEY) {
    const content = `${os.EOL}OPEN_AI_KEY=${key || process.env.OPEN_AI_KEY}${
      os.EOL
    }`;
    appendFileSync(destEnvPath, content, "utf-8");
    console.log(colors.green("login succeed!\n"));
    console.log(
      colors.green("now you can try chaty run web/node/command/etc...")
    );
    process.exit(0);
  } else {
    console.log(
      colors.red(
        "[Error]: login need key!(like login sk-dxxxxxxx) or OPEN_AI_KEY in current directory .env file!"
      )
    );
    process.exit(1);
  }
};
