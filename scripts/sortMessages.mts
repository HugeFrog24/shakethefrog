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
  ka: string[];
}

function stripEmojis(str: string): string {
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{2600}-\u{26FF}]/gu, '').trim();
}

function sortMessages() {
  try {
    // Read and parse JSON
    const messages: Messages = JSON.parse(readFileSync(messagesPath, 'utf8'));

    // Check message lengths and collect warnings
    const warnings: string[] = [];
    const CHARACTER_LIMIT = 41;
    
    // Check for duplicates in each language
    Object.entries(messages).forEach(([lang, msgs]) => {
      // Create a map of stripped messages to their original forms
      const strippedToOriginal = new Map<string, string[]>();
      
      msgs.forEach((msg: string) => {
        // Length check
        if (msg.length > CHARACTER_LIMIT) {
          warnings.push(
            `Warning: ${lang} message exceeds ${CHARACTER_LIMIT} characters ` +
            `(actual: ${msg.length}): "${msg}"`
          );
        }

        // Duplicate check
        const stripped = stripEmojis(msg);
        const existing = strippedToOriginal.get(stripped) || [];
        existing.push(msg);
        strippedToOriginal.set(stripped, existing);
      });

      // Add duplicate warnings
      strippedToOriginal.forEach((originals, stripped) => {
        if (originals.length > 1) {
          warnings.push(
            `Warning: ${lang} has duplicate messages (ignoring emojis):\n` +
            originals.map(m => `  "${m}"`).join('\n')
          );
        }
      });
    });

    // Sort each language array
    const sortedMessages: Messages = {
      en: [...messages.en].sort((a, b) => a.localeCompare(b, 'en')),
      de: [...messages.de].sort((a, b) => a.localeCompare(b, 'de')),
      ru: [...messages.ru].sort((a, b) => a.localeCompare(b, 'ru')),
      ka: [...messages.ka].sort((a, b) => a.localeCompare(b, 'ka'))
    };

    // Write back to JSON file with pretty printing
    writeFileSync(
      messagesPath, 
      JSON.stringify(sortedMessages, null, 2),
      'utf8'
    );
    
    console.log('Messages sorted successfully!');
    
    // Display warnings if any were collected
    if (warnings.length > 0) {
      console.warn('\nLength warnings:');
      warnings.forEach(warning => console.warn(warning));
    }
  } catch (error) {
    console.error('Error sorting messages:', error);
  }
}

sortMessages(); 