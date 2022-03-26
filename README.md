# Playback controller
The project of developping extension to speedup video played inside default HTML5 player. Also features such as speedup amount dependent from video volume are planned to be added.

## The steps done:

[Detailed guide](https://dev.to/khangnd/build-a-browser-extension-with-svelte-3135)

* Project creation:
```shell
npx npx degit sveltejs/template playback_controller
cd playback_controller
```

* Preparation
```shell
node .\scripts\setupTypeScript.js
npm install --save-dev webextension-polyfill
npm install --save-dev @types/webextension-polyfill
npm install
```