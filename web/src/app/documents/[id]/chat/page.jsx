import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, MessageCircle, User, Bot } from "lucide-react";
import useUser from "@/utils/useUser";

export default function DocumentChatPage({ params }) {
  const { data: user, loading: userLoading } = useUser();
  const documentId = params.id;
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

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

  // Chat mutation
  const chatMutation = useMutation({
    mutationFn: async ({ documentId, message }) => {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: parseInt(documentId), message }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Add both user message and AI response to chat history
      setChatHistory(prev => [
        ...prev,
        { type: "user", content: variables.message, timestamp: new Date() },
        { type: "assistant", content: data.response, timestamp: new Date() }
      ]);
      setMessage("");
    },
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || chatMutation.isPending) return;

    chatMutation.mutate({ documentId, message });
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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
            Please sign in to chat with this document
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

  if (document.processingStatus !== "completed") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 font-jetbrains-mono">
            Document is still processing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 font-jetbrains-mono">
            Please wait for the document to finish processing before starting a chat.
          </p>
          <a
            href={`/documents/${documentId}`}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors font-jetbrains-mono"
          >
            Back to Document
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <a
              href={`/documents/${documentId}`}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </a>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
                  Chat with {document.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  Ask questions about your document content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-6">
            {chatHistory.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 font-jetbrains-mono">
                  Start a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-jetbrains-mono">
                  Ask questions about "{document.title}" and get instant answers from AI.
                </p>
                <div className="mt-6 space-y-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono">
                    Try asking:
                  </p>
                  <div className="space-y-1">
                    <button
                      onClick={() => setMessage("What are the main topics covered in this document?")}
                      className="block mx-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono text-sm"
                    >
                      "What are the main topics covered in this document?"
                    </button>
                    <button
                      onClick={() => setMessage("Can you explain the key concepts?")}
                      className="block mx-auto px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-jetbrains-mono text-sm"
                    >
                      "Can you explain the key concepts?"
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-3xl ${
                      msg.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.type === "user"
                          ? "bg-orange-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.type === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-orange-600 text-white"
                          : "bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700"
                      }`}
                    >
                      <p className="font-jetbrains-mono text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.type === "user"
                            ? "text-orange-100"
                            : "text-gray-500 dark:text-gray-400"
                        } font-jetbrains-mono`}
                      >
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3 max-w-3xl">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white dark:bg-[#262626] text-gray-900 dark:text-gray-100 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 px-4 py-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="font-jetbrains-mono text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex-shrink-0">
            <div className="flex space-x-4">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask a question about this document..."
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-jetbrains-mono"
                disabled={chatMutation.isPending}
              />
              <button
                type="submit"
                disabled={!message.trim() || chatMutation.isPending}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 font-jetbrains-mono"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </form>

          {chatMutation.isError && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-jetbrains-mono text-sm">
                Failed to send message. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}