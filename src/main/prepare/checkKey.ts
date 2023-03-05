import colors from "colors";

export function checkKey(key: string): void {
  if (!process.env[key]) {
    console.log(colors.red(`[Error]: please login first!`));
    process.exit(1)
  }
}
