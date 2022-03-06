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