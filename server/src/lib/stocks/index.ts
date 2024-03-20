import { config } from "@config";

const baseUrl = "https://www.alphavantage.co";

const getLatestPrice = async (ticker: string) => {
    const url = getUrl("/query", { "function": "GLOBAL_QUOTE", symbol: ticker });
    const json = await request<GetQuoteResponse>(url);
    return {
        symbol: json["Global Quote"]["01. symbol"],
        price: +json["Global Quote"]["05. price"]
    };
};

async function request<T>(url: string) {
    return await fetch(url).then(res => res.json()) as T;
}

function getUrl(path: string, params?: Record<string, string>) {
    let url = `${baseUrl}${path}`;
    if (params) {
    }
    params ??= {};
    params["apikey"] = config.env.STOCK_API_KEY!;

    const entries = Object.entries(params);
    url += entries.reduce((str, [key, val], i) => {
        return str + (i === 0 ? "?" : "&") + `${key}=${val}`;
    }, "");

    return url;
}

type GetQuoteResponse = {
    "Global Quote": {
        "01. symbol": string;
        "02. open": string;
        "03. high": string;
        "04. low": string;
        "05. price": string;
        "06. volume": string;
        "07. latest trading day": string;
        "08. previous close": string;
        "09. change": string;
        "10. change percent": string;
    };
};

export default {
    getLatestPrice
}
