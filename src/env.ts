
const DEFAULT_PAGE_URL = 'https://www.mhsr.sk/ministerstvo/dotacie/dotacie-v-roku-2019';
const DEFAULT_XPATH_PDF_LABEL = 'string(/html/body/section[2]/div/article/div/ul/li[20]/ul/li[24]/a/div/text())';
const DEFAULT_XPATH_PDF_URL = 'string(/html/body/section[2]/div/article/div/ul/li[20]/ul/li[24]/a/@href)';
const DEFAULT_EXPIRATION_MILLIS = '600000'; // 10 mins

export const pageUrl = process.env.PAGE_URL || DEFAULT_PAGE_URL;
export const xpathPdfLabel = process.env.XPATH_PDF_LABEL || DEFAULT_XPATH_PDF_LABEL;
export const xpathPdfUrl = process.env.XPATH_PDF_URL || DEFAULT_XPATH_PDF_URL;

export const expirationMillis = parseInt(process.env.EXPIRATION_MILLIS || DEFAULT_EXPIRATION_MILLIS, 10);

export const gaId = process.env.GA_ID;
