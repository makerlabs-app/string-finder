import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { red, green, cyan, yellow, blue } from "https://deno.land/std@0.199.0/fmt/colors.ts";

export const searchInWebPage = async ({
  url,
  string,
  iteration,
  headers: headersInput
}: {
    url: string;
    string: string;
    iteration?: number;
    headersInput?: string[];
}) => {
    const headers = headersInput?.flatMap(h => h.split(',').map(item => item.trim())) || [];

    for (let i = 0; i < (iteration || 1); i++) {
        const uuid = self.crypto.randomUUID();
        const requestUrl = `${url}?param=${uuid}`;

        // Fetch the content from the given URL
        const response = await fetch(requestUrl);
        const body = await response.text();

        if (body.includes(string)) {
            console.log(green(`${blue(string)} String was FOUND ${requestUrl} ${cyan(`(HTTP ${response.status})`)}`));
        } else {
            console.log(red(`${blue(string)} String NOT found ${requestUrl} ${cyan(`(HTTP ${response.status})`)}`));
        }

        console.log(yellow("Headers:"));

        if (headers.length > 0) {
            headers.forEach(header => {
                console.log(`  ${cyan(header)}: ${response.headers.get(header) || 'Not Present'}`);
            });
        } else {
            for (const [key, value] of response.headers) {
                console.log(`  ${cyan(key)}: ${value}`);
            }
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
    .option("-p, --headers [headers:string]", "Specific headers to display in the response. Use commas to separate multiple headers.", {
        collect: true
    })
    .action(searchInWebPage);

if (import.meta.main) {
    await cli.parse(Deno.args);
}
