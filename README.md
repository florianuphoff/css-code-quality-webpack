# stylesheet code quality webpack plugin
This is a webpack plugin to analyse and visualize the code quality of S(C)SS based web applications.

The static analysis is done with stylelint and further plugins. The ruleset is based on scientific research which can be read when the masterthesis is finished. 

Webpack is used to hook into the bundling of an app. There is no reporting of errors to webpack. Instead the plugin ships with an integrated dashboard which can be accessed through the original application. On bundling the dashboard is put into a public folder. Of course this can be changed through configuration.

:exclamation: Caution: This plugin is under development and not ready for any integration. Any update will be published here

## Usage

```bash
npm install stylesheet-code-quality-webpack-plugin  --save-dev
```
