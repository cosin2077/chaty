import { argv } from "../init";
import { runWebService } from "./web";
import { runCommandLineService } from "./command";



export const runService = async () => {
  if (argv._.length === 0 && Object.keys(argv).length === 1) {
    await runCommandLineService()
  }
  if (argv.web) {
    await runWebService()
  }
}