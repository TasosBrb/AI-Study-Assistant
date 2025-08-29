import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, title, questionCount = 10, questionTypes = ["multiple_choice", "true_false"] } = body;

    if (!documentId) {
      return Response.json({ error: "Document ID is required" }, { status: 400 });
    }

    // Get the document
    const documents = await sql`
      SELECT * FROM documents 
      WHERE id = ${documentId} AND user_id = ${session.user.id}
    `;

    if (documents.length === 0) {
      return Response.json({ error: "Document not found" }, { status: 404 });
    }

    const document = documents[0];

    if (document.processing_status !== 'completed') {
      return Response.json({ error: "Document is not ready for quiz generation" }, { status: 400 });
    }

    // Generate quiz using AI
    const quizResponse = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are an AI study assistant that creates educational quizzes. Generate a quiz based on the provided document content. Create ${questionCount} questions using the specified question types: ${questionTypes.join(", ")}.

            For multiple choice questions, provide 4 options with one correct answer.
            For true/false questions, provide a statement and the correct answer.
            
            Return the quiz in JSON format with a 'questions' array. Each question should have:
            - type: "multiple_choice" or "true_false"
            - question: the question text
            - options: array of options (for multiple choice) or null (for true/false)
            - correctAnswer: the correct answer (index for multiple choice, boolean for true/false)
            - explanation: brief explanation of the correct answer`
          },
          {
            role: "user",
            content: `Create a quiz based on this document:
            
            Title: ${document.title}
            Summary: ${document.summary}
            Chapters: ${JSON.stringify(document.chapters)}
            
            Generate ${questionCount} questions covering the key concepts from this material.`
          }
        ],
        json_schema: {
          name: "quiz_generation",
          schema: {
            type: "object",
            properties: {
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    question: { type: "string" },
                    options: {
                      type: ["array", "null"],
                      items: { type: "string" }
                    },
                    correctAnswer: { type: ["number", "boolean"] },
                    explanation: { type: "string" }
                  },
                  required: ["type", "question", "options", "correctAnswer", "explanation"],
                  additionalProperties: false
                }
              }
            },
            required: ["questions"],
            additionalProperties: false
          }
        }
      }),
    });

    if (!quizResponse.ok) {
      throw new Error("Failed to generate quiz");
    }

    const quizData = await quizResponse.json();
    const quiz = JSON.parse(quizData.choices[0].message.content);

    // Save quiz to database
    const result = await sql`
      INSERT INTO quizzes (user_id, document_id, title, questions)
      VALUES (${session.user.id}, ${documentId}, ${title || `Quiz for ${document.title}`}, ${JSON.stringify(quiz.questions)})
      RETURNING *
    `;

    const savedQuiz = result[0];

    return Response.json({ 
      success: true,
      quiz: {
        id: savedQuiz.id,
        title: savedQuiz.title,
        questions: quiz.questions,
        createdDate: savedQuiz.created_date
      }
    });

  } catch (error) {
    console.error("Quiz generation error:", error);
    return Response.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}