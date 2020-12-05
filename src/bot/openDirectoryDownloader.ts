import { cpus } from "os";
import execa from "execa";
import { rm, rmdir, readdir } from "fs/promises";
import config from "./constants.json"

export default async function get_open_directory_info(url: string, should_file_size_be_exact?: boolean): Promise<string>
{
  const max_thread = cpus().length == 1 ? 32 : 16; // check for 1 core cuz I want to have a lot of thread on the xeon of my vps ~ Vini
  const open_directory_downloader_args: Array<string> =
    [
      `--url`,
      url,
      "--quit",
      `-t`,
      max_thread.toString(),
      "--speedtest",
    ];
  if (should_file_size_be_exact)
    open_directory_downloader_args.push("--exact-file-sizes");

  return new Promise(async (resolve, reject) =>
  {
    const openDirectoryDownloader: string = process.platform === "win32" || process.platform === "cygwin" ?
     `${config.OpenDirectoryDownloaderPath}/Window_OpenDirectoryDownloader.exe` : `${config.OpenDirectoryDownloaderPath}/Linux_OpenDirectoryDownloader`;
    let program_output: string = "";
    let out = await execa(openDirectoryDownloader, open_directory_downloader_args, {
      timeout: 120000,
      all: true,
      encoding: "utf8",
      reject: false
    });

    const regexes = [ // https://regex101.com/r/eg8xcA/4
      /\|\*\*Url\:\*\* \[?https?:\/\/(\w+|\.)+(\:\d+)?(\/.*)?/, // pass1
      /\|:-\|-:\|-:\|/, // pass 2
      /\|\*\*Extension \(Top 5\)\*\*\|\*\*Files\*\*\|\*\*Size\*\*\|/, // pass 3
      /\|\.\w+\|\d+\|(\d|\.)+\s\w+\|{1,5}/gm, // pass 4
      /\|\*\*(Date ()|Dirs).*/g // pass 5
    ];
    let prgm_output = out.stdout;
    let md_table: string = "";
    let found: Array<string> = [];
    md_table += out.stdout.match(regexes[0])[0];
    md_table += out.stdout.match(regexes[1])[0];
    md_table += out.stdout.match(regexes[2])[0];
    for (let i = 0; i < 6; i++)
    {
      let matching_result = regexes[3].exec(out.stdout);
      try
      {
        matching_result[0];
      }
      catch
      {
        continue;
      }

      if (!found.includes(matching_result[0]) && matching_result[0])
      {
        found.push(matching_result[0]);
        md_table += matching_result + "\n";
      }
    }
    md_table += regexes[4].exec(out.stdout)[0] + "\n";
    md_table += regexes[4].exec(out.stdout)[0];
    
    clean_open_directory_folder_async()
    resolve(md_table);
  });
}

async function clean_open_directory_folder_async(): Promise<void>
{
  return new Promise(async (resolve, reject) =>
  {
    Promise.all([
      rmdir(`${config.OpenDirectoryDownloaderPath}/LogArchives`, { recursive: true }),
      rmdir(`${config.OpenDirectoryDownloaderPath}/Scans`, { recursive: true }),
      rm(`./${config.OpenDirectoryDownloaderPath}/History.log`, { force: true })
    ])
      .then(() => resolve())
      .catch();
  });
}