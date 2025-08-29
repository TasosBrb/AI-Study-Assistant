import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";

// Get all documents for the current user
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const documents = await sql`
      SELECT 
        id,
        title,
        filename,
        file_url,
        file_size,
        upload_date,
        processing_status,
        summary,
        chapters
      FROM documents 
      WHERE user_id = ${session.user.id}
      ORDER BY upload_date DESC
    `;

    return Response.json({ 
      success: true, 
      documents: documents.map(doc => ({
        id: doc.id,
        title: doc.title,
        filename: doc.filename,
        fileUrl: doc.file_url,
        fileSize: doc.file_size,
        uploadDate: doc.upload_date,
        processingStatus: doc.processing_status,
        summary: doc.summary,
        chapters: doc.chapters
      }))
    });

  } catch (error) {
    console.error("Get documents error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}