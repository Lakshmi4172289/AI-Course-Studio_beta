import { GoogleGenAI, Type } from "@google/genai";
import { Course, Chapter, QuizQuestion, ExternalLink } from "../types";

const PRIMARY_MODEL = "gemini-3-pro-preview"; 
const FALLBACK_MODEL = "gemini-3-flash-preview";

/**
 * Helper to clean Markdown code blocks from JSON response
 */
const cleanJSON = (text: string) => {
  if (!text) return "{}";
  // Remove markdown code blocks if present
  let clean = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
  // Remove any leading/trailing whitespace
  clean = clean.trim();
  return clean;
};

/**
 * Extracts a valid YouTube Video ID from a URL or string.
 */
const extractYouTubeID = (urlOrId: string | undefined): string | null => {
    if (!urlOrId) return null;
    // If it's explicitly an 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId;
    
    // Handle full URLs
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Fallback pool if AI fails completely. 
 */
const getFallbackVideoId = (query: string): string => {
  const genericPool = [
    "pQN-pnXPaVg", // Git
    "kUmC1P588e0", // Web Dev
    "W6NZfCO5SIk", // JS
    "8ndxrZz4F_Y", // Docker
    "QFaFIcGhPoM", // Django
  ];
  const index = Math.abs(query.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % genericPool.length;
  return genericPool[index];
};

/**
 * Smart wrapper to handle model fallbacks for quota/rate limits
 */
const generateWithFallback = async (ai: GoogleGenAI, prompt: string, schema: any = null) => {
  const config: any = { responseMimeType: "application/json" };
  if (schema) {
    config.responseSchema = schema;
  }

  try {
    // 1. Try Primary Model (High Intelligence)
    console.log(`Attempting generation with ${PRIMARY_MODEL}...`);
    const response = await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: prompt,
      config: config
    });
    return response;
  } catch (error: any) {
    // 2. Fallback to Flash (High Availability/Speed) if Primary fails
    console.warn(`Primary model ${PRIMARY_MODEL} failed (likely quota). Switching to ${FALLBACK_MODEL}.`, error);
    
    try {
      const response = await ai.models.generateContent({
        model: FALLBACK_MODEL,
        contents: prompt,
        config: config
      });
      return response;
    } catch (fallbackError) {
      console.error("Fallback model also failed:", fallbackError);
      throw fallbackError; // Rethrow if both fail
    }
  }
};

export const generateCourseSyllabus = async (topic: string): Promise<Partial<Course>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are an expert curriculum designer. Create a comprehensive syllabus for a course on "${topic}".
      
      Requirements:
      1. **Description**: Write a brief, compelling 2-sentence overview.
      2. **Chapters**: Create a roadmap with **8 to 15 highly specific chapters**. 
         - **NO GENERIC NAMES**: Avoid "Introduction", "Basics", "Conclusion".
         - **SPECIFIC TITLES**: Use industry-standard, technical, or deep-dive titles (e.g., "Dependency Injection Patterns" instead of "Advanced Setup").
         - **Logical Flow**: Sequential mastery path.
      3. Return valid JSON.

      Example JSON:
      {
        "title": "Mastering Advanced React Patterns",
        "description": "...",
        "chapters": ["Reconciliation Engine & Fiber Architecture", "Compound Components & Render Props", "Custom Hook Composition"]
      }
    `;

    const response = await generateWithFallback(ai, prompt, {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        chapters: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text || "{}";
    let data;
    try {
        data = JSON.parse(cleanJSON(text));
    } catch (e) {
        console.warn("JSON Parse Error in Syllabus", e);
        data = {};
    }
    
    const chapters = Array.isArray(data?.chapters) && data.chapters.length > 0
      ? data.chapters 
      : ["Core Fundamentals Deep Dive", "Architecture Exploration", "Implementation Strategies", "Optimization & Scaling"];
      
    const title = data?.title || topic;
    const description = data?.description || `A complete guide to ${topic}.`;
    const courseId = crypto.randomUUID();
    
    return {
      id: courseId,
      title: title,
      description: description,
      totalChapters: chapters.length,
      completedChapters: 0,
      createdAt: new Date(),
      chapters: chapters.map((title: string, index: number) => ({
        id: `${courseId}-ch-${index}`,
        title: title,
        order: index + 1,
        isCompleted: false,
        content_md: "",
        videoId_1: "",
        videoId_2: "",
        external_links: [],
        quiz: []
      }))
    };

  } catch (error) {
    console.error("Gemini Syllabus Error:", error);
    throw error;
  }
};

export const generateChapterContent = async (chapterTitle: string, courseTopic: string): Promise<Partial<Chapter>> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a world-class instructor. Generate content for the chapter "${chapterTitle}" of the course "${courseTopic}".

      **CRITICAL DOMAIN INSTRUCTION**:
      - FIRST, determine if "${courseTopic}" is a Technical/Programming topic or a General/Humanities topic.
      - **IF TECHNICAL (Programming, Math, Engineering):** You MUST include code blocks, formulas, or technical diagrams in Markdown.
      - **IF GENERAL (History, Psychology, Business, Art):** Do NOT use code blocks. Focus on narrative, timelines, case studies, and conceptual frameworks.

      **FORMATTING RULES**:
      - **Humanize the Tone**: Write like a senior mentor speaking to a colleague. Warm, professional, and encouraging.
      - **Avoid Artifacts**: Do NOT use '***', excessive bolding, or robotic transition words.
      - **Clean Markdown**: Use standard headers (#, ##), bullet points, and paragraphs.
      
      **Content Structure**:
      1. **The Core Concept**: Deep dive into the theory. Use analogies.
      2. **Practical Application**: 
         - If Coding: "Let's Build It" (Code examples).
         - If History/General: "Case Study / Real World Scenario".
      3. **Why It Matters**: Industry relevance or historical significance.
      4. **Common Pitfalls**: What do beginners get wrong?

      **Quiz Requirements**:
      - Generate **EXACTLY 5** multiple-choice questions.
      - Questions should test understanding and reasoning, not just memory.

      **External Resources**:
      - Provide 3 distinct, REAL URLs to high-quality documentation, reputable articles, or official guides.

      **Output JSON Schema**:
      {
        "content_md": "string (markdown)",
        "quiz": [
           { "id": 1, "question": "...", "options": ["A","B","C","D"], "correctAnswer": 0, "explanation": "..." }
        ],
        "external_links": [
           { "title": "...", "url": "...", "type": "article" }
        ],
        "videoId_1": "string (11 chars)",
        "videoId_2": "string (11 chars)"
      }
    `;

    const response = await generateWithFallback(ai, prompt);

    const text = response.text || "{}";
    let data;
    try {
        data = JSON.parse(cleanJSON(text));
    } catch (e) {
        console.warn("JSON Parse Error in Content", e);
        data = {};
    }

    let v1 = extractYouTubeID(data.videoId_1);
    let v2 = extractYouTubeID(data.videoId_2);
    if (!v1) v1 = getFallbackVideoId(`${courseTopic} ${chapterTitle} 1`);
    if (!v2) v2 = getFallbackVideoId(`${courseTopic} ${chapterTitle} 2`);

    // Enforce 5 questions fallback
    let quiz = Array.isArray(data.quiz) ? data.quiz : [];
    if (quiz.length < 5) {
        // AI sometimes fails to give 5, we fill up if possible or just accept what it gave but prioritize 5 in prompt
    }

    return {
      content_md: data.content_md || "## Content Unavailable\nWe apologize, but we couldn't generate the content for this chapter.",
      quiz: quiz,
      external_links: Array.isArray(data.external_links) ? data.external_links : [],
      videoId_1: v1,
      videoId_2: v2
    };

  } catch (error) {
    console.error("Gemini Content Error:", error);
    return {
      content_md: "## Error\nUnable to generate content.",
      quiz: [],
      external_links: [],
      videoId_1: "kUmC1P588e0",
      videoId_2: "pQN-pnXPaVg"
    };
  }
};