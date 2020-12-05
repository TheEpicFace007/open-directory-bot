/**
 * This file generate configuration for the bot
 */
import { program } from "commander"
import { writeFileSync, existsSync, mkdirSync } from "fs";

program.requiredOption("-s, --secret <secret key>", "The reddit secret token");
program.requiredOption("-a, --acess-token <acess token>", "The reddit acess token");
program.requiredOption("-n, --username <username>", "The bot username");
program.requiredOption("-p, --password <password>", "The bot password");

program.description("Generate the bot configuration file");
program.version("0.0.1");

program.parse()

console.log("Writting config . . .")
if (!existsSync("./config/"))
  mkdirSync("./config")

writeFileSync("./config/reddit-bot-config.json", JSON.stringify({
  secret: program.secret,
  accessToken: program.acessToken,
  username: program.username,
  password: program.password,
  useragent: `open-directory-bot (node ${process.version})`
}, undefined, 2))

console.log("Wrote config!")