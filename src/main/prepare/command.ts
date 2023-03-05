import commander from "commander";
import colors from "colors";
import pkg from "../../../package.json";
import { runWebService } from "../commands/web";
import { runWechatService } from "../commands/wechat";
import { runCommandLineService } from "../commands/commandLine";
import { runLogin } from "./login";
import { setLang } from "../commands/lang";
import { checkKey } from "./checkKey";
import { chatyDebug } from "./debug";

const program = new commander.Command();

export function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage(`<command> [options]`)
    .version(pkg.version)
    .description(
      `
Chaty supports various services such as:
    chaty run commandline (command-line chatbot)
    chaty run web (private ChatGPT website services)
    chaty run wechat (WeChat chatbot)
    stay tune! more services are under construction...
To get started, just run "chaty login <openAIKey>" and enter your openAIKey. Once login is successful, you can begin exploring.`
    )
    .option("-d, --debug", "debug mode", false);

  program
    .command("run [service]")
    .description("run web/command-line/node/wechat/etc service")
    .action((name, options, command) => {
      checkKey("OPEN_AI_KEY");
      chatyDebug("run:", name, options);
      switch (name) {
        case name && (name.match(/web/im) || {}).input:
          runWebService();
          break;
        case name && (name.match(/command/im) || {}).input:
          runCommandLineService();
          break;
        case name && (name.match(/node(js)?|api/im) || {}).input:
          console.log("under construction...");
          process.exit(0);
          break;
        case name && (name.match(/wechat/im) || {}).input:
          runWechatService();
          break;
        default:
          console.log(colors.red(`[Error]: unknown service ${name}!\n`));
          console.log(
            colors.green(`Only support: web command node wechat telegram`)
          );
          process.exit(1);
      }
    });

  program
    .command("login [openAIKey]")
    .description(
      "login with openAIKey. You can find your API key at https://platform.openai.com/account/api-keys."
    )
    .action((key, options, command) => {
      chatyDebug("login:", key, options);
      runLogin(key);
    });

  program
    .command("lang [language]")
    .description(
      "set display language, English and Chinese are supported at present"
    )
    .action((key, options, command) => {
      chatyDebug("lang:", key, options);
      setLang(key);
    });

  program.on("option:debug", () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
  });
  program.on("command:*", (obj) => {
    const availableCommands = program.commands.map((command) => command.name());
    if (!availableCommands.includes(obj[0])) {
      console.log(colors.red(`[Error]Unknown command: ${obj[0]}`));
      console.log();
      console.log(
        colors.green(`Available commands: ${availableCommands.join(",")}`)
      );
      process.exit(1);
    }
  });
  program.parse(process.argv);
  if (program.args.length < 1) {
    program.outputHelp();
    console.log();
  }
}
