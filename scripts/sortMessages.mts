import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const messagesDir = join(__dirname, '..', 'app', 'config', 'messages');

// Define supported languages
type SupportedLanguage = 'en' | 'de' | 'ru' | 'ka';

function stripEmojis(str: string): string {
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{2600}-\u{26FF}]/gu, '').trim();
}

function sortMessages() {
  try {
    // Get all JSON files in the messages directory
    const files = readdirSync(messagesDir).filter(file => file.endsWith('.json'));
    const warnings: string[] = [];
    const CHARACTER_LIMIT = 41;

    files.forEach(file => {
      const lang = file.replace('.json', '') as SupportedLanguage;
      const filePath = join(messagesDir, file);
      
      // Read and parse JSON
      const messages: string[] = JSON.parse(readFileSync(filePath, 'utf8'));

      // Check message lengths and duplicates
      const strippedToOriginal = new Map<string, string[]>();
      
      messages.forEach((msg: string) => {
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
      strippedToOriginal.forEach((originals) => {
        if (originals.length > 1) {
          warnings.push(
            `Warning: ${lang} has duplicate messages (ignoring emojis):\n` +
            originals.map(m => `  "${m}"`).join('\n')
          );
        }
      });

      // Sort messages using appropriate locale
      const sortedMessages = [...messages].sort((a, b) => a.localeCompare(b, lang));

      // Write back to JSON file with pretty printing
      writeFileSync(
        filePath,
        JSON.stringify(sortedMessages, null, 2),
        'utf8'
      );

      console.log(`Messages sorted successfully for ${lang}!`);
    });
    
    // Display warnings if any were collected
    if (warnings.length > 0) {
      console.warn('\nWarnings:');
      warnings.forEach(warning => console.warn(warning));
    }
  } catch (error) {
    console.error('Error sorting messages:', error);
  }
}

sortMessages();