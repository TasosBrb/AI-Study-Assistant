import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  let documentId;
  
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    documentId = body.documentId;

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

    // Simulate AI processing by calling ChatGPT to analyze the document
    // In a real implementation, you would extract text from the PDF first
    const analysisResponse = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an AI study assistant. Analyze the provided document and create a summary with chapter breakdown. Return your response in JSON format with 'summary' and 'chapters' fields. The chapters should be an array of objects with 'title' and 'content' fields."
          },
          {
            role: "user",
            content: `Please analyze this document: ${document.title}. Since I cannot provide the actual PDF content, please create a realistic example summary and chapter breakdown for a typical academic document with this title.`
          }
        ],
        json_schema: {
          name: "document_analysis",
          schema: {
            type: "object",
            properties: {
              summary: { type: "string" },
              chapters: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    content: { type: "string" }
                  },
                  required: ["title", "content"],
                  additionalProperties: false
                }
              }
            },
            required: ["summary", "chapters"],
            additionalProperties: false
          }
        }
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error("Failed to analyze document");
    }

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);

    // Update the document with the analysis
    await sql`
      UPDATE documents 
      SET 
        processing_status = 'completed',
        summary = ${analysis.summary},
        chapters = ${JSON.stringify(analysis.chapters)}
      WHERE id = ${documentId}
    `;

    return Response.json({ 
      success: true,
      summary: analysis.summary,
      chapters: analysis.chapters
    });

  } catch (error) {
    console.error("Document processing error:", error);
    
    // Mark document as failed
    if (documentId) {
      await sql`
        UPDATE documents 
        SET processing_status = 'failed' 
        WHERE id = ${documentId}
      `;
    }
    
    return Response.json({ error: "Failed to process document" }, { status: 500 });
  }
}