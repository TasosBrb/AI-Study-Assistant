import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText, MessageCircle, Brain, Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import useUser from "@/utils/useUser";
import useUpload from "@/utils/useUpload";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, { loading: uploading }] = useUpload();
  const [uploadError, setUploadError] = useState(null);

  // Fetch user documents
  const { data: documentsData, isLoading: documentsLoading, refetch: refetchDocuments } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await fetch("/api/documents");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
    enabled: !!user,
  });

  const documents = documentsData?.documents || [];

  const handleFileUpload = async (file) => {
    try {
      setUploadError(null);
      
      // Upload file
      const { url, error } = await upload({ file });
      if (error) {
        setUploadError(error);
        return;
      }

      // Save document to database
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: url,
          fileName: file.name,
          fileSize: file.size,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save document");
      }

      const result = await response.json();
      
      // Start processing the document
      await fetch("/api/documents/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: result.document.id,
        }),
      });

      // Refresh documents list
      refetchDocuments();
      setSelectedFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Failed to upload document");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-orange-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Ready";
      case "processing":
        return "Processing...";
      case "failed":
        return "Failed";
      default:
        return "Pending";
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Please sign in to access your dashboard
          </h1>
          <a
            href="/account/signin"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                Welcome back, {user.email}
              </p>
            </div>
            <a
              href="/account/logout"
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors font-jetbrains-mono"
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Section */}
        <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Upload New Document
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-4 font-jetbrains-mono">
              Drag and drop your PDF file here, or click to browse
            </p>
            
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 cursor-pointer transition-colors font-jetbrains-mono"
            >
              Choose File
            </label>
          </div>

          {selectedFile && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => handleFileUpload(selectedFile)}
                  disabled={uploading}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors font-jetbrains-mono"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-jetbrains-mono">
                {uploadError}
              </p>
            </div>
          )}
        </div>

        {/* Documents Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
            Your Documents
          </h2>

          {documentsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#262626] rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                No documents uploaded yet. Upload your first PDF to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <FileText className="w-8 h-8 text-orange-600 flex-shrink-0" />
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.processingStatus)}
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                        {getStatusText(doc.processingStatus)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                    {doc.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-jetbrains-mono">
                    Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>

                  {doc.processingStatus === "completed" && (
                    <div className="space-y-2">
                      <a
                        href={`/documents/${doc.id}`}
                        className="flex items-center space-x-2 w-full px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors font-jetbrains-mono"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Summary</span>
                      </a>
                      
                      <a
                        href={`/documents/${doc.id}/chat`}
                        className="flex items-center space-x-2 w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-jetbrains-mono"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Chat</span>
                      </a>
                      
                      <a
                        href={`/documents/${doc.id}/quiz`}
                        className="flex items-center space-x-2 w-full px-3 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors font-jetbrains-mono"
                      >
                        <Brain className="w-4 h-4" />
                        <span>Generate Quiz</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}