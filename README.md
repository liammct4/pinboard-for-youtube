# Pinboard for YouTube

<p align="center">
  <img width="145" height="145" alt="logo" src="https://github.com/user-attachments/assets/9e7f8efb-439c-4897-ab34-f6ea9fd2e414"/>
</p>

This is a simple, convenient Chrome (and Edge) extension which allows you to save and "bookmark" videos and timestamps in a very organized manner using a directory system.

## Demo
Find the demo video here:

[![Pinboard for YouTube Demo](https://img.youtube.com/vi/CJy-5docF3w/1.jpg)](https://www.youtube.com/watch?v=CJy-5docF3w)

## How to install 
Download the extension via the [Chrome Web Store](https://chromewebstore.google.com/detail/onhlcaclglibpmkgdjcaaijnepbiljam).

Or if you prefer, manually [build the project](https://github.com/liammct4/pinboard-for-youtube/#building) then follow the steps below (Edge):
1) (Recommended) After building the project, copy it somewhere, such as a general applications folder.
2) Open the extensions tab.
3) Enable developer mode.
4) Click load unpacked.
5) Find the extension folder and load it.
6) Whenever you want to update to the latest version, rebuild the project, copy the build to where you loaded it from, and replace the files with the build. Close the browser first before you do this.

## Contributing
You can contribute to this project by either suggesting features or reporting issues you have encountered.

### Bug reports
Please use the issues tab in this repository to report an issue you are having, please try to be as specific, if possible include the stack trace if its a crash (which can be found in the text box on at the bottom of the crash page) as well as any general information, such as how to reproduce the issue as well as any specific details relating to it.

### Suggestions & Questions
I am open to any suggestions or questions you may have, please check the discussions page for this.

## Building and debugging
This project uses Vite with React, Rollup, TypeScript and Jest for testing.

### Prerequisites
1) Install [node](https://nodejs.org/en) if you haven't already.
2) Copy this repository using `git clone https://github.com/liammct4/pinboard-for-youtube.git`.
3) Enter the directory using `cd pinboard-for-youtube`.
4) Run `npm i --force` to install modules. (Yes using --force is terrible, I haven't bothered to sort this lol).

### Debug/development mode
1) Use `npm run dev` to start the development server.
2) Open the localhost page on the port listed in the terminal.
3) Since it is just a standard Vite/React project, it supports hot reload and all the general features Vite comes with.

### Building
1) Use `npm run build` to start the build, since this is my first project using Node/JavaScript, I wrote my own Python script to copy necessary files (such as assets and the manifest) and haven't bothered to get rid of it, you will need Python installed. 
2) While this uses Vite, it also uses a separate Rollup build configuration used exclusively for the content script which is injected into the YouTube page. So after the extension is built using Vite, a Rollup build will start.
3) The content script build can also be ran separately from the main build using `npm run cs`.
4) The build will be located in the `/dist` folder and can simply be imported.

### Tests
1) This project uses Jest for testing.
2) Run the tests using `npm run test`.
3) The tests, while not covering 100%, or even the majority of the code, are up to date in the parts that are covered.

## About this project
I originally started this project a few years ago since I got a bit tired of having a big text file full of unorganized/unlabelled timestamps and links. Now since YouTube does include a "Watch history" feature, I tried to use that, but in my experience, it just does not work very well.

It would sometimes just not jump to the last point I watched, or just be outdated, and I didn't want absolutely every video to be in my watch history. It also doesn't allow you to track and reference multiple points in videos.

So I decided to make this project, it's especially useful for podcasts which I watch a lot and I've been using it properly since last year.

I also wanted to use this project to learn React and web development in general, since this is my first JavaScript/React project, theres a LOT of bad practices in the projects history, or maybe in it right now, (have a look at how I handled forms in the past or directory/video state management using useVideoStateAccess() before I refactored it into Redux).

This project did also include a fully functional accounts system with a backend using AWS Lambda, however I decided not to use it, I was originally planning to use the `chrome.storage.sync` API but I found out it only holds a very small amount of data, so I might consider re-enabling it again if I find it helpful.

The code for it can be found [here](https://github.com/liammct4/pinboard-for-youtube-backend-api). Like this project with React, this was also my first time using AWS or any cloud service in general.
