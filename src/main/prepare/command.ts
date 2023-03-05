import commander from "commander";
import colors from "colors";
import pkg from "../../../package.json";
import { runWebService } from "../run/web";
import { runCommandLineService } from "../run/command";
import { runLogin } from "./login";
import { setLang } from "./lang";

const program = new commander.Command();

export function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage(`<command> [options]`)
    .version(pkg.version)
    .description(
      `Chaty supports various services such as command-line chatbot, private ChatGPT website services, WeChat chatbot, etc. 
    To get started, just run "chaty login <openAIKey>" and enter your openAIKey. Once login is successful, you can begin exploring.`
    )
    .option("-d, --debug", "debug mode", false);

  program
    .command("run [service]")
    .description("run web/command-line/node/wechat/etc service")
    .action((name, options, command) => {
      console.log("run:", name, options);
      switch (name) {
        case name && (name.match(/web/gim) || {}).input:
          runWebService();
          break;
        case name && (name.match(/command/gim) || {}).input:
          runCommandLineService();
          break;
        case name && (name.match(/node/gim) || {}).input:
          console.log("under construction...");
          process.exit(0);
        case name && (name.match(/wechat/gim) || {}).input:
          console.log("under construction...");
          process.exit(0);
        default:
          console.log(colors.red(`[Error]: unknown service ${name}!\n`));
          console.log(
            colors.green(`Only support web command node wechat telegram`)
          );
          process.exit(1);
      }
    });

  program
    .command("login [openAIKey]")
    .description("login with openAIKey")
    .action((key, options, command) => {
      console.log("login:", key, options);
      runLogin(key);
    });
  
  program
    .command("lang [language]")
    .description("set display language, English and Chinese are supported at present")
    .action((key, options, command) => {
      console.log("lang:", key, options);
      setLang(key);
    });

  // 开启debug模式
  program.on("option:debug", () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    console.log(program.opts());
  });
  // 未知命令的监听
  program.on("command:*", (obj) => {
    const availableCommands = program.commands.map((command) => command.name());
    if (!availableCommands.includes(obj[0])) {
      console.log(colors.red(`[Error]Unknown command: ${obj[0]}`));
      console.log();
      console.log(
        colors.green(`[Tips]Available commands: ${availableCommands.join(",")}`)
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
