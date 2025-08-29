import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, FileText, MessageCircle, Brain, Clock, CheckCircle, AlertCircle } from "lucide-react";
import useUser from "@/utils/useUser";

export default function DocumentDetailPage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const documentId = params.id;

  // Fetch document details
  const { data: documentsData, isLoading: documentLoading } = useQuery({
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

  const document = documentsData?.documents?.find(doc => doc.id === parseInt(documentId));

  if (userLoading || documentLoading) {
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
            Please sign in to view this document
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

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Document not found
          </h1>
          <a
            href="/dashboard"
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E]">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <a
              href="/dashboard"
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-orange-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                    {document.title}
                  </h1>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusIcon(document.processingStatus)}
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                      {getStatusText(document.processingStatus)}
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500 font-jetbrains-mono">
                      • Uploaded {new Date(document.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {document.processingStatus === "processing" && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-orange-600 animate-spin" />
              <div>
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 font-jetbrains-mono">
                  Processing Document
                </h3>
                <p className="text-orange-700 dark:text-orange-300 font-jetbrains-mono">
                  Your document is being analyzed by AI. This usually takes a few minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {document.processingStatus === "failed" && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 font-jetbrains-mono">
                  Processing Failed
                </h3>
                <p className="text-red-700 dark:text-red-300 font-jetbrains-mono">
                  There was an error processing your document. Please try uploading it again.
                </p>
              </div>
            </div>
          </div>
        )}

        {document.processingStatus === "completed" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Document Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-jetbrains-mono">
                  {document.summary}
                </p>
              </div>

              {/* Chapters */}
              {document.chapters && document.chapters.length > 0 && (
                <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 font-jetbrains-mono">
                    Chapters
                  </h2>
                  <div className="space-y-6">
                    {document.chapters.map((chapter, index) => (
                      <div key={index} className="border-l-4 border-orange-500 pl-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                          {chapter.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-jetbrains-mono">
                          {chapter.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Actions */}
              <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Study Tools
                </h3>
                <div className="space-y-3">
                  <a
                    href={`/documents/${document.id}/chat`}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-jetbrains-mono"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat with Document</span>
                  </a>
                  
                  <a
                    href={`/documents/${document.id}/quiz`}
                    className="flex items-center space-x-3 w-full px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors font-jetbrains-mono"
                  >
                    <Brain className="w-5 h-5" />
                    <span>Generate Quiz</span>
                  </a>
                </div>
              </div>

              {/* Document Info */}
              <div className="bg-white dark:bg-[#262626] rounded-xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
                  Document Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">Filename:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-jetbrains-mono">{document.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">Size:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      {document.fileSize ? `${(document.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">Uploaded:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                      {new Date(document.uploadDate).toLocaleDateString()}
                    </span>
                  </div>
                  {document.chapters && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">Chapters:</span>
                      <span className="text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                        {document.chapters.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}