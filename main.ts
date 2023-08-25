import {Command} from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import {bgBlue, cyan, green, red, yellow} from "https://deno.land/std@0.199.0/fmt/colors.ts";
import {Parameters} from "./interfaces.ts";

const searchInWebPage = async ({
    url: url,
    stringToFind: stringToFind,
    iteration: iteration,
    responseHeader: responseHeader
}: Parameters) => {

    for (let i = 0; i < (iteration || 1); i++) {
        const uuid = self.crypto.randomUUID();
        const requestUrl = `${url}?param=${uuid}`;

        const response = await request(requestUrl);
        const body = await response.text();

        if (body.includes(stringToFind)) {
            console.log(requestUrl + ' ' + cyan(`(HTTP ${response.status}) `) + bgBlue(stringToFind) + green(' String FOUND'));
        } else {
            console.log(requestUrl + ' ' + cyan(`(HTTP ${response.status}) `) + bgBlue(stringToFind) + red(' String NOT FOUND'));
        }

        if (responseHeader !== undefined) {
            displayResponseHeaders(responseHeader, response);
        }
    }
}

async function request(url : string) : Promise<Response> {
    return await fetch(url);
}

function displayResponseHeaders(headersInput: string[], response: Response): string[] {
    const headers = headersInput?.flatMap(h => h.split(',').map(item => item.trim())) || [];

    if (headers.length === 0) {
        return [];
    }

    if (headers.length === 1 && headers[0] === 'all') {
        console.log(yellow("Headers:"));
        for (const [key, value] of response.headers) {
            console.log(`  ${cyan(key)}: ${value}`);
        }

        return headers;
    }

    if (headers.length > 0) {
        console.log(yellow("Headers:"));
        headers.forEach(header => {
            console.log(`  ${cyan(header)}: ${response.headers.get(header) || 'Not Present'}`);
        });
    }

    return headers;
}

const cli = new Command()
    .name("WebStringFinder")
    .description("A Deno tool to efficiently find specific strings within the content of a given URL.")
    .option("-u, --url <url:string>", "The URL from which the content should be fetched.")
    .option("-s, --stringToFind <stringToFind:string>", "The string to find in the content of the provided URL.")
    .option("-i, --iteration [iteration:number]", "Number of times to check the URL for the string. Defaults to 1.", {
        default: 1
    })
    .option("-a, --response-header [response-header:string]", "Specific response header to display. Use commas to separate multiple headers.", {
        collect: true
    })
    .action(searchInWebPage);

if (import.meta.main) {
    await cli.parse(Deno.args);
}
