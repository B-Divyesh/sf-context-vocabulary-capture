# Keep the Sentence

Keep the Sentence is a local browser extension for language learners reading regular web pages in Chromium. Select a phrase, save nearby sentences and its source link, write your own meaning, and review it later in context.

It saves a selected phrase with nearby sentences and its source link.

## Try the sample demo

Open `/?demo=1` after starting the site, or visit [the live demo](https://context-vocabulary-capture.sociobot.in/?demo=1). It loads three sample phrases in a separate `demo:` storage namespace. The banner can reset the samples, and leaving Demo discards them.

## Install the extension

Run the build. The packaged extension is at `dist/site/downloads/keep-the-sentence-extension.zip`.

1. Download and extract the ZIP.
2. Open your Chromium browser’s extensions page.
3. Turn on Developer mode.
4. Choose **Load unpacked** and select the extracted folder.
5. On a web page, select a phrase and choose **Keep this sentence** from the right-click menu.

The extension stores encrypted records in browser-local extension storage. No account or network service is needed. Saved phrases can be reviewed offline. Use **Export CSV** from the popup to move your phrases to another tool.

## Develop, test, and build

```sh
npm ci
npm run dev             # extension development build
npm run dev:site        # landing site at the shown local URL
npm test
npm run test:copy       # verify rendered copy and word counts
npm run build           # extension -> dist/extension; static site -> dist/site
```

`npm run build` is the reproducible deployment command. The static deploy root is `dist/site`, where `index.html` is at the root.

## Privacy

It stores only an ID, phrase, nearby text, source title and link, language, meaning, review count, and capture and review dates. The extension sends no analytics or product data to any server. Read the deployed `/privacy` and `/terms` pages for details.

## License

MIT. See [LICENSE](LICENSE).
