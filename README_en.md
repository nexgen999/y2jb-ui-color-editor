# Y2JB UI Color Editor

This application is a visual editor designed to customize the interface colors and text strings of the **ps5-y2jb-autoloader**.

## 🛠 Usage

1. Customize colors and text strings using the sidebar.
2. You can choose between a solid color or an image (`background.jpg`) for the interface background.
3. Click the "Exporter export.js" button.
4. Take the generated `export.js` file and replace the original file (usually `main.js`) in your project from [ps5-y2jb-autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader).
5. If you chose the Image option, don't forget to add a file named `background.jpg` in the same folder as your `main.js` on your host.

**Note:** This version of the editor is compatible only with **release v0.5** of the autoloader.

## 🚀 Local Installation

To run this application on your machine:

1. Ensure you have **Node.js** installed.
2. Clone or download this project.
3. Open a terminal in the project folder.
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open your browser at `http://localhost:3000`.

## 🏗️ Credits

Based on the original work by Gezine and PLK for the [ps5-y2jb-autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader) project.
