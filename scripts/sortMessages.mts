import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const messagesPath = join(__dirname, '..', 'app', 'config', 'messages.json');

interface Messages {
  en: string[];
  de: string[];
  ru: string[];
}

function sortMessages() {
  try {
    // Read and parse JSON
    const messages: Messages = JSON.parse(readFileSync(messagesPath, 'utf8'));

    // Sort each language array
    const sortedMessages: Messages = {
      en: [...messages.en].sort((a, b) => a.localeCompare(b, 'en')),
      de: [...messages.de].sort((a, b) => a.localeCompare(b, 'de')),
      ru: [...messages.ru].sort((a, b) => a.localeCompare(b, 'ru'))
    };

    // Write back to JSON file with pretty printing
    writeFileSync(
      messagesPath, 
      JSON.stringify(sortedMessages, null, 2),
      'utf8'
    );
    
    console.log('Messages sorted successfully!');
  } catch (error) {
    console.error('Error sorting messages:', error);
  }
}

sortMessages(); 