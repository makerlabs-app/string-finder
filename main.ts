import {Command} from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import {bgBlue, bgGreen, bgBrightYellow, bgBrightCyan, bgRed, cyan, green, red, yellow} from "https://deno.land/std@0.199.0/fmt/colors.ts";
import {Parameters, HttpHeaders} from "./interfaces.ts";

const searchInWebPage = async ({
    url: url,
    stringToFind: stringToFind,
    iteration: iteration,
    param: param,
    requestHeader: requestHeader,
    responseHeader: responseHeader
}: Parameters) => {

    for (let i = 0; i < (iteration || 1); i++) {
        let requestUrl = url + param;

        if (i >= 1) {
            requestUrl = `${requestUrl}&i=${i}`;
        }

        const headersJson = parseRequestHeadersJsonString(requestHeader);
        const response = await request(requestUrl, 'GET', headersJson);
        const body = await response.text();
        const displayCode = chooseColorForHttpCodeResponse(response.status);

        if (body.includes(stringToFind)) {
            console.log(displayCode + ' ' + requestUrl + ' ' + bgBlue(stringToFind) + green(' String FOUND'));
        } else {
            console.log(displayCode + ' ' + requestUrl + ' ' + bgBlue(stringToFind) + red(' String NOT FOUND'));
        }

        if (responseHeader !== undefined) {
            displayResponseHeaders(responseHeader, response);
        }
    }
}

function chooseColorForHttpCodeResponse(codeResponse : number) {
    const codeString = codeResponse.toString();
    const code = codeString[0];
    let displayCode = '';

    switch (code) {
        case '2':
            displayCode = bgGreen(`HTTP ${codeResponse}`)
            break;
        case '4':
            displayCode = bgBrightYellow(`HTTP ${codeResponse}`)
            break;
        case '5':
            displayCode = bgRed(`HTTP ${codeResponse}`)
            break;
        default:
            displayCode = bgBrightCyan(`HTTP ${codeResponse}`)
    }

    return displayCode;
}

async function request(url : string, method : string, headers: HttpHeaders) : Promise<Response> {
    return await fetch(url, {
        method: method,
        headers: headers
    });
}

function parseRequestHeadersJsonString (headersJsonString: string) {
    try {
        return JSON.parse(headersJsonString);
    } catch (error) {
        console.log(headersJsonString);
        throw new Error("Failed to parse the provided headers JSON:", error.message);
    }
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
    .option("-s, --string-to-find <string-to-find:string>", "The string to find in the content of the provided URL.")
    .option("-p, --param [param:string]", "Query parameters to pass with the URL", {
        default: '?param=finder'
    })
    .option("-i, --iteration [iteration:number]", "Number of times to check the URL for the string. Defaults to 1.", {
        default: 1
    })
    .option("-q, --request-header [request-header:string]", "Add headers in your request. Provide them as a JSON string.", {
        default: '{"String-Finder":"Default"}'
    })
    .option("-a, --response-header [response-header:string]", "Specific response header to display. Use commas to separate multiple headers.", {
        collect: true
    })
    .action(searchInWebPage);

if (import.meta.main) {
    await cli.parse(Deno.args);
}
