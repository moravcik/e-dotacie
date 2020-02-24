import * as express from 'express';
import * as morgan from 'morgan';
import * as http from 'http';
import * as rp from 'request-promise';
import * as xpath from 'xpath';
import { DOMParser } from 'xmldom';

import { expirationMillis, gaId, pageUrl, xpathPdfLabel, xpathPdfUrl } from './env';

type Pdf = {
  label: string;
  url: string;
  timestamp: number;
}

export default function startServer() {
  const app = express();

  app.enable('trust proxy');

  app.use(morgan('dev')); // log requests to console

  app.get('/pdf', async (req, res) => {
    const { url } = await resolvePdf();
    res.send(`
<html>
  <head>
    ${gaSnippet}
  </head>
  <body style="margin: 0px; padding: 0px">
    <iframe src="https://docs.google.com/gview?url=${url}&embedded=true" style="width:100%; height:100%;" frameborder="0"></iframe>
  </body>
</html>
`)
  });

  app.get('/', async (req, res) => {
    const { label, url } = await resolvePdf();
    res.send(`
<html>
  <head>
    ${gaSnippet}
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  </head>
  <body>
    <div class="container h-100 d-flex">
      <div class="jumbotron my-auto">
        <h3 class="display-5">Predbežné vyhodnotenie žiadostí o dotácie na nákup elektromobilov a plug-in hybridov</h3>
        <p class="lead"><a href="${url}">${label}</a></p>
        <hr class="my-4">
        <p>Zdroj: <a href="${pageUrl}">${pageUrl}</a></p>
      </div>
    </div>
  </body>
</html>`);
  });

  const port: number = parseInt(process.env.PORT, 10) || 5000;
  const httpServer = http.createServer(app);

  httpServer.listen(port);
  console.log(`App listening on port ${port}`);
}

let pdf: Pdf;

const gaSnippet = gaId ? `
    <!-- Google Analytics -->
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    
    ga('create', '${gaId}', 'auto');
    ga('send', 'pageview');
    </script>
    <!-- End Google Analytics -->
` : '';

async function resolvePdf(): Promise<Pdf> {
  const now = Date.now();

  if (pdf && pdf.timestamp + expirationMillis > now) {
    console.log('PDF cache hit');
    console.log(pdf);
    return pdf;
  }

  const pageHtml = await rp.get(pageUrl);
  const doc = new DOMParser({ errorHandler: () => {} }).parseFromString(pageHtml);

  pdf = {
    label: xpath.select(xpathPdfLabel, doc).toString().trim(),
    url: xpath.select(xpathPdfUrl, doc).toString(),
    timestamp: now
  };

  console.log('PDF resolved')
  console.log(pdf);
  return pdf;
}
