# Keep the Sentence

Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. Select a phrase, save it with nearby sentences and the page link, add your meaning, and review it later in context.

## Try the sample demo

Open `/?demo=1` after starting the site, or visit [the live demo](https://context-vocabulary-capture.sociobot.in/?demo=1). It keeps three sample phrases separate from your saved phrases. The banner can reset the samples, and leaving Demo discards them.

## Install the extension

It is free to download and use. Run the build. The packaged extension is at `dist/site/downloads/keep-the-sentence-extension.zip`.

1. Download and extract the ZIP.
2. Open your Chromium browser’s extensions page.
3. Turn on Developer mode.
4. Choose **Load unpacked** and select the extracted folder.
5. On a web page, select a phrase and choose **Keep this sentence** from the right-click menu.

The extension encrypts your saved phrases and stores them only in Chromium. No account is needed. Saved phrases can be reviewed offline. Use **Export CSV** from the popup to move your phrases to another tool.

## Develop, test, and build

```sh
npm ci
npm run dev             # extension development build
npm run dev:site        # landing site at the shown local URL
npm test
npm run test:copy       # verify rendered copy and word counts
npm run build           # extension -> dist/extension; static site -> dist/site
```

Run `npm run build` to create `dist/site` and the extension ZIP. The static deploy root is `dist/site`, where `index.html` is at the root.

## Privacy

It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates. The extension sends no analytics or product data to any server. Read the deployed `/privacy` and `/terms` pages for details.

## License

MIT. See [LICENSE](LICENSE).
