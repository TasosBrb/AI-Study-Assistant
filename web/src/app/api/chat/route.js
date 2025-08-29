import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { documentId, message } = body;

    if (!documentId || !message) {
      return Response.json({ error: "Document ID and message are required" }, { status: 400 });
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

    // Get recent chat history for context
    const recentMessages = await sql`
      SELECT message, response 
      FROM chat_messages 
      WHERE document_id = ${documentId} AND user_id = ${session.user.id}
      ORDER BY message_date DESC 
      LIMIT 5
    `;

    // Build conversation context
    const conversationHistory = [];
    
    // Add system message with document context
    conversationHistory.push({
      role: "system",
      content: `You are an AI study assistant helping a student understand their document: "${document.title}". 
      
      Document Summary: ${document.summary || "No summary available"}
      
      Document Chapters: ${document.chapters ? JSON.stringify(document.chapters) : "No chapters available"}
      
      Answer questions about this document content. Be helpful, accurate, and educational. When possible, reference specific sections or chapters from the document.`
    });

    // Add recent conversation history (in reverse order)
    recentMessages.reverse().forEach(msg => {
      conversationHistory.push({ role: "user", content: msg.message });
      conversationHistory.push({ role: "assistant", content: msg.response });
    });

    // Add current message
    conversationHistory.push({ role: "user", content: message });

    // Get AI response
    const chatResponse = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationHistory,
        stream: false
      }),
    });

    if (!chatResponse.ok) {
      throw new Error("Failed to get AI response");
    }

    const chatData = await chatResponse.json();
    const aiResponse = chatData.choices[0].message.content;

    // Save the conversation to database
    await sql`
      INSERT INTO chat_messages (user_id, document_id, message, response)
      VALUES (${session.user.id}, ${documentId}, ${message}, ${aiResponse})
    `;

    return Response.json({ 
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error("Chat error:", error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
}