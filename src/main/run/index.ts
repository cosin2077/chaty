import { argv } from "../init";
import { runWebService } from "./web";



export const runService = async () => {
  if (argv.web) {
    await runWebService()
  }
}