import { SubmissionStream } from "snoostorm";
import Snoowrap, { SnoowrapOptions } from "snoowrap";
import { readFileSync } from "fs";
import submission_handler from "./submission_handler";

const config: SnoowrapOptions = JSON.parse(readFileSync("./config/reddit-bot-config.json", {encoding: "utf-8"}))

const snoowrap = new Snoowrap(config)

const openDirectorySubmissionStream: SubmissionStream = new SubmissionStream(snoowrap, {
  subreddit: "testingground4bots"
}); 

openDirectorySubmissionStream.on("item", submission_handler)