import dotenv from "dotenv";
dotenv.config();
import { debug } from "./init";

if (!process.env.OPEN_AI_KEY) {
  debug("OPEN_AI_KEY needed!");
  process.exit(1);
}
