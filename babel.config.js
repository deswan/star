module.exports = {
    "presets": [
      [
        "@babel/preset-env",
        {
          "modules": false,
          "targets": {
            "browsers": [
              "> 1%",
              "last 2 versions",
              "not ie <= 8"
            ]
          }
        }
      ]
    ],
    "plugins": [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-syntax-dynamic-import",
      "@babel/plugin-syntax-import-meta",
      "@babel/plugin-proposal-class-properties",
      "@babel/plugin-proposal-json-strings",
      [
        "@babel/plugin-proposal-decorators",
        {
          "legacy": true
        }
      ],
      "@babel/plugin-proposal-function-sent",
      "@babel/plugin-proposal-export-namespace-from",
      "@babel/plugin-proposal-numeric-separator",
      "@babel/plugin-proposal-throw-expressions"
    ],
    "env": {
      "test": {
        "presets": [
          "@babel/preset-env"
        ],
        "plugins": [
          "@babel/plugin-transform-modules-commonjs",
          "dynamic-import-node",
          "@babel/plugin-syntax-dynamic-import",
          "@babel/plugin-syntax-import-meta",
          "@babel/plugin-proposal-class-properties",
          "@babel/plugin-proposal-json-strings",
          [
            "@babel/plugin-proposal-decorators",
            {
              "legacy": true
            }
          ],
          "@babel/plugin-proposal-function-sent",
          "@babel/plugin-proposal-export-namespace-from",
          "@babel/plugin-proposal-numeric-separator",
          "@babel/plugin-proposal-throw-expressions"
        ]
      }
    }
  }
  