# feynman

## Inspiration
The story began when both of us found that we reinforce what we learn the best when teaching others, when we got questioned during the teaching process, we got thorough understanding. So we wanted to see if we could teach an AI model and get feedback from them. We wanted to have a "student" that would scrutinize what we say and was able to catch mistakes that we make. Because we both like drawing things out, we also wanted to enable to model to have a visual input.
## What it does
Ghost of Feynman (Gof) is an interactive voice and canvas-enabled learning partner. In our web app, users are able to upload files (limited to PDFs at the moment) to view on the side as they utilize the canvas (or not) to teach our voice assistant something. The voice assistant has access to tools that allow them to visualize what's drawn by the user on the canvas.
## How we built it
We built the core canvas drawing and audio recording functionality using WebSocket technology. The main application is deployed on Render, while the canvas viewer, PDF processor, and ElevenLabs API integration are deployed separately on Vercel. Once a user begins teaching, the system captures both their voice input and canvas drawings in real-time, allowing the AI to provide intelligent feedback based on both modalities. We built a tool for AI to capture what users are writing or drawing in canvas, display in texts and Mermaid diagrams. We used elevenLabs to use the stream agent to give real-time feedback. We also built a summary model using Xai-grok.
## Challenges we ran into
Learning WebSocket and learning the way for agent to read the canvas in real time.
## Accomplishments that we're proud of

## What we learned

## What's next for Ghost of Feynman
1. Scale up to support multi-threaded usage - Enable concurrent sessions so multiple users can interact with the platform simultaneously.
2. Add a rewarding and history system - Implement progress tracking and achievement rewards to motivate learners, along with a history feature to review past teaching sessions and concepts.
3. Expand with multi-disciplinary fine-tuning - Customize the model for specific academic fields to provide more specialized feedback across different domains of knowledge.
