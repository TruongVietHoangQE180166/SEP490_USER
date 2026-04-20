/**
 * A lightweight replacement for google-tts-api to avoid vulnerable axios dependencies.
 * This implementation only constructs the URL for Google Translate TTS.
 */

export interface TTSOptions {
  lang?: string;
  slow?: boolean;
  host?: string;
}

export interface AudioUrlItem {
  url: string;
  shortText: string;
}

/**
 * Splits a string into chunks of a given size without breaking words.
 */
function splitText(text: string, maxLength: number): string[] {
  const chunks: string[] = [];
  let currentPos = 0;

  while (currentPos < text.length) {
    let nextPos = currentPos + maxLength;
    
    if (nextPos < text.length) {
      // Find the last space before the limit
      const lastSpace = text.lastIndexOf(' ', nextPos);
      if (lastSpace > currentPos) {
        nextPos = lastSpace;
      }
    }

    chunks.push(text.substring(currentPos, nextPos).trim());
    currentPos = nextPos;
  }

  return chunks.filter(c => c.length > 0);
}

/**
 * Generates Google Translate TTS URLs for a given text.
 * Automatically handles text exceeding 200 characters by splitting it into chunks.
 */
export function getAllAudioUrls(
  text: string,
  options: TTSOptions = {}
): AudioUrlItem[] {
  const { 
    lang = 'vi', 
    slow = false, 
    host = 'https://translate.googleapis.com' 
  } = options;

  // Google Translate TTS has a 200 character limit per request
  const chunks = splitText(text, 200);

  return chunks.map((chunk) => {
    const params = new URLSearchParams({
      ie: 'UTF-8',
      q: chunk,
      tl: lang,
      total: chunks.length.toString(),
      idx: '0', // idx doesn't seem to matter for the simple tw-ob client
      textlen: chunk.length.toString(),
      client: 'tw-ob',
      prev: 'input',
      ttsspeed: slow ? '0.24' : '1'
    });

    return {
      url: `${host}/translate_tts?${params.toString()}`,
      shortText: chunk
    };
  });
}
