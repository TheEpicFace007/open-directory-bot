import { SubmissionStream } from "snoostorm";
import Snoowrap, { SnoowrapOptions } from "snoowrap";
import { readFileSync } from "fs";

const config: SnoowrapOptions = JSON.parse(readFileSync("reddit-bot-config.json", {encoding: "utf-8"}))
Object.freeze(config);

const snoowrap = new Snoowrap(config)

const openDirectorySubmissionStream: SubmissionStream = new SubmissionStream(snoowrap, {
  subreddit: ""
})