const fs = require('fs');
const { PDFParse } = require('pdf-parse');

const PDF_PATH = 'C:/Users/KING/Desktop/open/Saasi Hydrous Matt finish.pdf';

async function extractShades() {
    let parser;
    try {
        const dataBuffer = fs.readFileSync(PDF_PATH);
        parser = new PDFParse({ data: dataBuffer });
        const result = await parser.getText();

        const text = result.text;
        console.log("--- RAW TEXT HEAD ---");
        console.log(text.substring(0, 500));

        console.log("\n--- RAW TEXT TAIL ---");
        console.log(text.substring(text.length - 500));

        fs.writeFileSync('C:/Users/KING/Desktop/open/tawakkal-paint/tmp_saasi_hydrous.txt', text);
        console.log('\nFull text saved to tmp_saasi_hydrous.txt');

    } catch (err) {
        console.error('Error reading PDF:', err);
    } finally {
        if (parser) {
            await parser.destroy();
        }
    }
}

extractShades();
