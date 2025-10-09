import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const messagesBaseDir = join(__dirname, '..', 'messages');

// Define supported languages
type SupportedLanguage = 'en' | 'de' | 'ru' | 'ka' | 'ar';

function stripEmojis(str: string): string {
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2700}-\u{27BF}]|[\u{2600}-\u{26FF}]/gu, '').trim();
}

function sortCharacterMessages(messagesObj: Record<string, string>, lang: SupportedLanguage): Record<string, string> {
  // Convert object to array of [key, value] pairs, sort by value, then convert back
  const entries = Object.entries(messagesObj);
  const sortedEntries = entries.sort(([, a], [, b]) => a.localeCompare(b, lang));
  
  // Rebuild object with sorted values but preserve original numeric keys
  const result: Record<string, string> = {};
  sortedEntries.forEach(([, value], index) => {
    result[index.toString()] = value;
  });
  
  return result;
}

function sortUIMessages(messagesObj: Record<string, unknown>): Record<string, unknown> {
  // For UI messages, sort by key (semantic names) to maintain consistent order
  const entries = Object.entries(messagesObj);
  const sortedEntries = entries.sort(([a], [b]) => a.localeCompare(b));
  
  // Rebuild object maintaining original semantic keys
  const result: Record<string, unknown> = {};
  sortedEntries.forEach(([key, value]) => {
    result[key] = value;
  });
  
  return result;
}

function extractStringsFromObject(obj: unknown, path: string = ''): string[] {
  const strings: string[] = [];
  
  if (typeof obj === 'string') {
    strings.push(obj);
  } else if (typeof obj === 'object' && obj !== null) {
    Object.entries(obj as Record<string, unknown>).forEach(([key, value]) => {
      const newPath = path ? `${path}.${key}` : key;
      strings.push(...extractStringsFromObject(value, newPath));
    });
  }
  
  return strings;
}

function sortMessages() {
  try {
    const warnings: string[] = [];
    const CHARACTER_LIMIT = 41;
    
    // Process both character and ui message directories
    const messageTypes = ['character', 'ui'];
    
    messageTypes.forEach(messageType => {
      const messagesDir = join(messagesBaseDir, messageType);
      
      if (!existsSync(messagesDir)) {
        console.warn(`Directory ${messagesDir} does not exist, skipping...`);
        return;
      }
      
      // Get all JSON files in the messages directory
      const files = readdirSync(messagesDir).filter(file => file.endsWith('.json'));

      files.forEach(file => {
        const lang = file.replace('.json', '') as SupportedLanguage;
        const filePath = join(messagesDir, file);
        
        // Read and parse JSON
        const messagesData = JSON.parse(readFileSync(filePath, 'utf8'));
        
        // Handle both object format (character messages) and direct object format (ui messages)
        let messages: string[];
        let isObjectFormat = false;
        let needsConversion = false;
        
        if (Array.isArray(messagesData)) {
          // Array format - needs conversion to object format for character messages
          messages = messagesData;
          needsConversion = messageType === 'character';
        } else if (typeof messagesData === 'object') {
          // Object format with numeric keys or direct key-value pairs
          if (messageType === 'ui') {
            // For UI messages, extract all string values from nested objects
            messages = extractStringsFromObject(messagesData);
          } else {
            // For character messages, simple object values
            messages = Object.values(messagesData);
          }
          isObjectFormat = true;
        } else {
          console.warn(`Unknown format in ${filePath}, skipping...`);
          return;
        }

        // Check message lengths and duplicates
        const strippedToOriginal = new Map<string, string[]>();
        
        messages.forEach((msg: string) => {
          // Length check - only apply to character messages, not UI messages
          if (messageType === 'character' && msg.length > CHARACTER_LIMIT) {
            warnings.push(
              `Warning: ${messageType}/${lang} message exceeds ${CHARACTER_LIMIT} characters ` +
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
              `Warning: ${messageType}/${lang} has duplicate messages (ignoring emojis):\n` +
              originals.map(m => `  "${m}"`).join('\n')
            );
          }
        });

        // Sort messages and write back
        if (needsConversion) {
          // Convert array to object format for character messages
          const sortedMessages = [...messages].sort((a, b) => a.localeCompare(b, lang));
          const objectMessages: Record<string, string> = {};
          sortedMessages.forEach((message, index) => {
            objectMessages[index.toString()] = message;
          });
          
          writeFileSync(
            filePath,
            JSON.stringify(objectMessages, null, 2),
            'utf8'
          );
        } else if (isObjectFormat) {
          let sortedMessages;
          
          if (messageType === 'character') {
            // Character messages: sort by value and use numeric keys
            sortedMessages = sortCharacterMessages(messagesData, lang);
          } else {
            // UI messages: sort by key and preserve semantic keys
            sortedMessages = sortUIMessages(messagesData);
          }
          
          // Write back to JSON file with pretty printing
          writeFileSync(
            filePath,
            JSON.stringify(sortedMessages, null, 2),
            'utf8'
          );
        } else {
          // Handle array format (legacy) - shouldn't happen anymore
          const sortedMessages = [...messages].sort((a, b) => a.localeCompare(b, lang));
          
          writeFileSync(
            filePath,
            JSON.stringify(sortedMessages, null, 2),
            'utf8'
          );
        }

        console.log(`Messages sorted successfully for ${messageType}/${lang}!`);
      });
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