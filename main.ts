import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { red, green, cyan, yellow, blue } from "https://deno.land/std@0.199.0/fmt/colors.ts";

export const searchInWebPage = async ({
                                        url,
                                        string,
                                        iteration
                                      }: {
  url: string;
  string: string;
  iteration?: number;
}) => {
  for (let i = 0; i < (iteration || 1); i++) {
    const uuid = self.crypto.randomUUID();
    const requestUrl = `${url}?param=${uuid}`;

    // Fetch the content from the given URL
    const response = await fetch(requestUrl);
    const body = await response.text();

    // Display response status
    if (body.includes(string)) {
      console.log(green(`String ${blue(string)} was found ${requestUrl} ${cyan(`(HTTP ${response.status})`)}`));
    } else {
      console.log(red(`String ${blue(string)} was NOT found ${requestUrl} ${cyan(`(HTTP ${response.status})`)}`));
    }

    // Display headers
    console.log(yellow("Headers:"));
    for (const [key, value] of response.headers) {
      console.log(`  ${cyan(key)}: ${value}`);
    }
  }
}

const cli = new Command()
    .name("WebStringFinder")
    .description("A Deno tool to efficiently find specific strings within the content of a given URL.")
    .option("-u, --url <url:string>", "The URL from which the content should be fetched.")
    .option("-s, --string <string:string>", "The string to find in the content of the provided URL.")
    .option("-i, --iteration [iteration:number]", "Number of times to check the URL for the string. Defaults to 1.", {
      default: 1
    })
    .action(searchInWebPage);

if (import.meta.main) {
  await cli.parse(Deno.args);
}
