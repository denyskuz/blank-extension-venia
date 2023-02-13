# Blank Template for Venia Extensions

It is the CLI command for creating a blank extension folder with all dependencies for Venia. It allows us to create an empty extension for the current project or for a global plugin with all configurations. 


![template-cli](assets/project-template-cli.png)

## Install

```bash
npm i blank-extension-venia
```
OR
```bash
npx blank-extension-venia
```

## Usage

```bash
blank-extension-venia
```


## Template structure of global extension
Please don't forget to add your extension to trusted vendors for your project ```your_project/package.json``` in `pwa-studio` section. 
Example:
```json
   {
   "pwa-studio": {
       "targets": {
         "intercept": "./local-intercept.js"
       },
      "trusted-vendors": [
         "@vendorName"
      ]
   }
   }
```

```bash
├── src
│   └── components
│       └── index.js
│       └── Components.js
│       └── Components.module.css
│   └── talons
│       └── index.js
│       └── useComponent.js
│   └── targets
├── babel.config.js
├── index.js
├── intercept.js
├── jest.config.js
├── prettier.config.js
├── package.json
```
## Template structure of local extension

```bash
├── src
│   └── components
│       └── index.js
│       └── Components.js
│       └── Components.module.css
│   └── talons
│       └── index.js
│       └── useComponent.js
│   └── targets
├── index.js
├── intercept.js
├── package.json
```

## Intercept
The code in `intercept.js` makes it possible to include all files from the `target` folder, which will be included in `intercept.js` automatically. 

`intercept.js :`
```js
fs.readdirSync(__dirname + '/src/targets/').forEach( file => {
   require('<%= projectVendorName %>/src/targets/' + file)(targets);
});
```