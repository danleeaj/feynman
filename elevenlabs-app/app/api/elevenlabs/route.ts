import { ElevenLabsClient } from "elevenlabs";
import { NextRequest, NextResponse } from "next/server";

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the form data from the request
    const formData = await request.formData();
    const audioFile = formData.get("audio");

    // Validate that an audio file was provided
    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert the file to a Blob for ElevenLabs API
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBlob = new Blob([arrayBuffer], { type: audioFile.type });

    // Get optional parameters from form data
    const modelId = (formData.get("modelId") as string) || "scribe_v1";
    const tagAudioEvents = formData.get("tagAudioEvents") === "true";
    const languageCode = (formData.get("languageCode") as string) || "eng";
    const diarize = formData.get("diarize") === "true";

    // Call ElevenLabs Speech-to-Text API
    const transcription = await elevenlabs.speechToText.convert({
      file: audioBlob,
      model_id: modelId,
      tag_audio_events: tagAudioEvents,
      language_code: languageCode || undefined,
      diarize,
    });

    // Return the transcription result
    return NextResponse.json({
      success: true,
      transcription,
    });
  } catch (error) {
    console.error("ElevenLabs API error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Failed to process audio",
          message: error.message,
        },
        { status: 500 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
