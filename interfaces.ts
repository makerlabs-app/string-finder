export interface Parameters {
    url: string;
    stringToFind: string;
    iteration?: number | undefined;
    requestHeader: string;
    responseHeader?: string[] | undefined;
}

export interface HttpHeaders {
    [key: string]: string;
}

/*

J'ai cette fonction

async function request(url : string, method : string, headers: any) : Promise<Response> {
    return await fetch(url, {
        method: method,
        headers: headers
    });
}

(no-explicit-any) `any` type is not allowed
async function request(url : string, method : string, headers: any) : Promise<Response> {


en sachant que je lui donne des objets qui peuvent contenir ce type de data :

{"Accept-Language": "fr_fr", "X-Locale": "fr_fr"}
*/
