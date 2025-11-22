import { VPS_ENDPOINT, DEFAULT_VPS_KEY } from '../constants';
import { TranscribeResponse } from '../types';

export const transcribeVideo = async (file: File, apiKey: string = DEFAULT_VPS_KEY): Promise<TranscribeResponse> => {
  const formData = new FormData();
  formData.append('video', file);
  formData.append('key', apiKey);

  try {
    const response = await fetch(VPS_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`VPS Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data as TranscribeResponse;
  } catch (error) {
    console.error("Transcription failed:", error);
    throw error;
  }
};