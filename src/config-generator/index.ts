/**
 * This file generate configuration for the bot
 */
import { program } from "commander";
import { writeFileSync, existsSync, mkdirSync } from "fs";

program.requiredOption("-s, --client-secret <client secret>", "The reddit secret token");
program.requiredOption("-i, --client-id <Client ID>", "The reddit acess token");
program.requiredOption("-u, --username <username>", "The bot username");
program.requiredOption("-p, --password <password>", "The bot password");

program.description("Generate the bot configuration file");
program.version("0.0.1");

program.allowUnknownOption(false);

program.parse();

console.log("Writting config . . .");
if (!existsSync("./config/"))
{
  console.log("The config folder isn't found. Making the config folder");
  mkdirSync("./config");
  console.log("Made the config folder!");
}

writeFileSync("./config/reddit-bot-config.json", JSON.stringify({
  clientSecret: program.clientSecret,
  clientId: program.clientId,
  username: program.username,
  password: program.password,
  userAgent: `open-directory-bot (node ${process.version})`
}, undefined, 2));

console.log("Wrote config!");