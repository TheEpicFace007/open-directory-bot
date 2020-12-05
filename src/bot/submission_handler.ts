import Snoowrap from "snoowrap";
import openDirectoryInfo from "./openDirectoryDownloader";

export default function(submission: Snoowrap.Submission)
{
  if (submission.author.name !== "open_directory_bot")
    return;

  openDirectoryInfo(submission.url).then((stats) =>
  {
    submission.reply(stats);
  })
  .catch();
}