import Tesseract from 'tesseract.js';

export async function recognizeCardName(imageDataUrl) {
  const result = await Tesseract.recognize(imageDataUrl, 'eng', {
    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ',
  });
  const text = result.data.text;
  const firstLine = text.split('\n')[0].trim();
  return firstLine;
}