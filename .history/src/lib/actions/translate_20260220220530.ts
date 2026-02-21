'use server';

export async function translateText(text: string, sourceLang: string, targetLang: string) {
    if (!text) return '';

    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();

        // The Google Translate API returns an array where the first element is an array of translated segments.
        // For single words or short phrases, data[0][0][0] usually holds the translated text.
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }

        return '';
    } catch (error) {
        console.error('Translation error:', error);
        return '';
    }
}
