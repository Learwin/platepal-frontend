const path = require('path');

module.exports = {
  entry: './src/index.tsx', // Haupt-Entry Punkt des Projekts
  output: {
    filename: 'bundle.js', // Name der zusammengefügten Datei
    path: path.resolve(__dirname, 'dist') // Verzeichnis für das Bundle
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'], // Erweiterungen, die Webpack automatisch erkennt
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      assets: path.resolve(__dirname, 'src/assets'), // Für Bilder
      styles: path.resolve(__dirname, 'src/styles') // Für CSS-Dateien
    },
    fallback: {
      "fs": false, // added to resolve Node.js modules error in Webpack 5
    }
  },
  module: {
    rules: [
      {
        test: /\.module\.css$/, // Regel für .module.css Dateien
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts|\.tsx$/, // Regel für TypeScript Dateien
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i, // Regel für Bilddateien
        type: 'asset/resource', // verwendet Webpack 5's asset/resource um Dateipfade auszugeben
        generator: {
          filename: 'assets/images/[name].[ext]' // Dateiname und Pfad für die Bilddateien
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'), // Verzeichnis für statische Dateien
    compress: true, // Dateien werden komprimiert gesendet
    port: 3000 // Port für den Development Server
  },
  mode: 'development' // Entwicklung-Modus
};
