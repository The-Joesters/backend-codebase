import textToSpeech, { protos } from '@google-cloud/text-to-speech';
import fs from 'fs';
import util from 'util';
import path from 'path';

// Create an instance of the TextToSpeechClient
const client = new textToSpeech.TextToSpeechClient();

interface AudioResult {
    path: string;
    name: string;
}

class AudioService {
    // Method to convert text to audio
    async toAudio(text: string): Promise<AudioResult> {
        // Ensure the output directory exists
        const audioDir = path.join(__dirname, 'audio'); // Use your desired path
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir); // Create the directory if it doesn't exist
        }

        // Construct the request for the Text-to-Speech API
        const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
            input: { text: text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' as unknown as protos.google.cloud.texttospeech.v1.SsmlVoiceGender },
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        // Create a unique filename based on the current timestamp
        const fileName = `audio-${Date.now()}.mp3`;
        const filePath = path.join(audioDir, fileName);

        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(filePath, response.audioContent!, 'binary');

        console.log(`Audio content written to file: ${filePath}`);

        // Return the path and filename
        return {
            path: filePath,
            name: fileName,
        };
    }
}

export default new AudioService();
// (async () => {
//     const audioService = new AudioService();
//     try {
//         const result = await audioService.toAudio('Hello, world! This is a text-to-speech test.');
//         console.log('Saved audio file details:', result);
//     } catch (error) {
//         console.error('Error converting text to audio:', error);
//     }
// })();
