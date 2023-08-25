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

