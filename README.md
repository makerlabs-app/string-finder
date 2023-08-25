Web String Finder
=================

**Web String Finder** is a Deno tool designed to efficiently search for specific strings within the content of a given URL. It also offers the ability to check the URL multiple times and display specific HTTP response headers.

## Installation

Ensure you have [Deno](https://deno.land/) installed on your machine.


## Usage

```bash
deno run --allow-net main.ts -u <URL> -s <STRING> [-i <ITERATIONS>] [-a <HEADERS>]
```

### Options

- `-u, --url <url:string>`: The URL from which the content should be fetched.
- `-s, --string <string:string>`: The string to search for in the content of the provided URL.
- `-i, --iteration [iteration:number]`: Number of times to check the URL for the string. Defaults to 1.
- `-a, --headers [headers:string]`: Specific headers to display in the response. Use commas to separate multiple headers.

### Example

```bash
deno run --allow-net main.ts -u https://example.com -s "test" -i 3 -a "age,cache-control"
```

This will check the content of `https://example.com` three times, search for the string "test", and only display the response headers `age` and `cache-control`.

## License

This project is licensed under the MIT License. 

---
