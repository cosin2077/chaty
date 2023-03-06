import colors from 'colors'

export const checkKey = function (key: string): void {
  if (!process.env[key]) {
    console.log(colors.red('[Error]: please login first!'))
    process.exit(1)
  }
}
