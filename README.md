# feynman

> _We'll ask you questions as you study!_

## Inspiration

The story began when both of us found that we reinforce what we learn the best when teaching others. When we get questions during the teaching process, we gained a more thorough understanding of the topic we were teaching. So we wanted to see if we could teach an AI model and get feedback from them. We wanted to have a "student" that would scrutinize what we say and was able to catch mistakes that we make. Because we both like drawing things out, we also wanted to enable to model to have a visual input.

## What it does

Feynman is an interactive voice and canvas-enabled learning partner. In our web app, users are able to upload files (limited to PDFs at the moment) to view on the side as they utilize the canvas (or not) to teach our voice assistant something. The voice assistant has access to tools that allow them to visualize what's drawn by the user on the canvas.
How we built it

Our front end was built using Next.js (deployed on Vercel), and our back end server utilizes WebSockets to maintain a constant connection between the server and the user (deployed on Render). Once a user begins teaching, the system captures both their voice input and canvas drawings in real-time, allowing the AI to provide intelligent feedback based on both input modes. We built a tool for AI to capture what users are writing or drawing in canvas, display in text or Mermaid diagrams. We used agents in ElevenLabs to provide real time voice feedback. We also used xAI to build a image-to-text parser.

## Challenges we ran into

Learning WebSocket and trying to find a way for the ElevenLabs agent to read the canvas in real time.

## Accomplishments that we're proud of

Honestly building this app was a big accomplishment for us.

## What we learned

We learned that scope creep is real, and a lot of the things we wanted to build we weren't able to build in time. We also learned a handful of new technologies, as this is the first time we've utilized things like WebSockets and ElevenLabs.

## What's next for Feynman

1. Scale up to support multiple users. Right now only one user can use this program at a time.
2. Add a reward and history system. Implement progress tracking and achievement rewards to motivate learners, along with a history feature to review past teaching sessions and concepts.
3. Expand with multi-disciplinary fine-tuning. Customize the model for specific academic fields to provide more specialized feedback across different domains of knowledge.
