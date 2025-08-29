import { auth } from "@/auth";
import sql from "@/app/api/utils/sql";
import { upload } from "@/app/api/utils/upload";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileUrl, fileName, fileSize } = body;

    if (!fileUrl || !fileName) {
      return Response.json({ error: "File URL and name are required" }, { status: 400 });
    }

    // Upload the file to our storage
    const { url: uploadedUrl, error: uploadError } = await upload({ url: fileUrl });
    
    if (uploadError) {
      return Response.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Save document to database
    const result = await sql`
      INSERT INTO documents (user_id, title, filename, file_url, file_size, processing_status)
      VALUES (${session.user.id}, ${fileName}, ${fileName}, ${uploadedUrl}, ${fileSize || 0}, 'pending')
      RETURNING *
    `;

    const document = result[0];

    // Start processing the document (this would typically be done in a background job)
    // For now, we'll just mark it as processing
    await sql`
      UPDATE documents 
      SET processing_status = 'processing' 
      WHERE id = ${document.id}
    `;

    return Response.json({ 
      success: true, 
      document: {
        id: document.id,
        title: document.title,
        filename: document.filename,
        fileUrl: document.file_url,
        processingStatus: document.processing_status,
        uploadDate: document.upload_date
      }
    });

  } catch (error) {
    console.error("Document upload error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}