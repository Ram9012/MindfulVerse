import React, { useState, useRef } from "react";
import ConditionalSidebar from "@/components/layout/ConditionalSidebar";
import { useSidebar } from "@/lib/sidebar-context";
import { useTheme } from "@/lib/theme-context";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkle, Star, CloudSun, FileText, Upload, Send, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Research = () => {
  const { collapsed, isMobile } = useSidebar();
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setUploadedFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      console.log("Uploading file:", selectedFile.name);
      
      // Use XMLHttpRequest instead of fetch for better file upload handling
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://127.0.0.1:5000/api/upload-pdf", true);
      
      // Set up event handlers
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          toast({
            title: "PDF uploaded successfully",
            description: "You can now ask questions about the content",
          });
        } else {
          throw new Error(`Server responded with status: ${xhr.status}`);
        }
        setLoading(false);
      };
      
      xhr.onerror = function() {
        console.error("Network error occurred");
        toast({
          title: "Upload failed",
          description: "Network error occurred. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      };
      
      // Send the form data
      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload PDF. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast({
        title: "Empty question",
        description: "Please enter a question to ask",
        variant: "destructive",
      });
      return;
    }

    if (!uploadedFileName) {
      toast({
        title: "No PDF uploaded",
        description: "Please upload a PDF file first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/ask-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
          pdf_name: uploadedFileName,
        }),
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        title: "Failed to get answer",
        description: error instanceof Error ? error.message : "An error occurred while processing your question. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden ${
        theme === "dark"
          ? "bg-gradient-to-b from-[#262133] to-[#16112a]"
          : "bg-gradient-to-b from-slate-100 to-blue-50"
      }`}
    >
      <ConditionalSidebar />

      <div
        className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-300 ${
          collapsed ? "ml-16" : isMobile ? "ml-0" : "md:ml-64"
        } ${collapsed ? "max-w-[calc(100%-4rem)]" : "max-w-[calc(100%-16rem)]"}`}
      >
        <div className="flex justify-between items-start mb-8 animate-fade-in relative">
          {/* Dark purple background with animated stars */}
          <div
            className={`absolute -inset-6 rounded-xl overflow-hidden -z-10 ${
              theme === "dark"
                ? "bg-[#2d3142]/80"
                : "bg-gradient-to-r from-indigo-100 to-purple-200 shadow-md"
            }`}
          >
            {/* Animated stars */}
            {[...Array(20)].map((_, i) => (
              <div
                key={`header-star-${i}`}
                className="absolute animate-float"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${6 + Math.random() * 4}s`,
                  opacity: 0.6 + Math.random() * 0.4,
                  zIndex: 1,
                }}
              >
                {i % 3 === 0 ? (
                  <Sparkle
                    className={theme === "dark" ? "text-indigo-300" : "text-indigo-500"}
                    size={i % 2 === 0 ? 14 : 18}
                  />
                ) : i % 3 === 1 ? (
                  <Star
                    className={theme === "dark" ? "text-purple-300" : "text-purple-500"}
                    size={i % 2 === 0 ? 12 : 16}
                  />
                ) : (
                  <CloudSun
                    className={theme === "dark" ? "text-pink-300" : "text-pink-500"}
                    size={i % 2 === 0 ? 16 : 20}
                  />
                )}
              </div>
            ))}

            {/* Gradient overlay */}
            <div
              className={`absolute inset-0 ${
                theme === "dark"
                  ? "bg-gradient-to-r from-[#2d3142]/50 to-[#3e4259]/60"
                  : "bg-gradient-to-r from-indigo-100/70 to-purple-200/80"
              }`}
            ></div>
          </div>

          <div className="p-4">
            <h1
              className={`text-5xl font-bold mb-2 ${
                theme === "dark" ? "text-indigo-300" : "text-indigo-700"
              }`}
            >
              Research Portal
            </h1>
            <h2
              className={`text-3xl font-bold mb-2 ${
                theme === "dark" ? "text-indigo-200" : "text-indigo-600"
              }`}
            >
              PDF Analysis
            </h2>
            <p
              className={`text-xl mb-8 max-w-2xl ${
                theme === "dark" ? "text-indigo-200/70" : "text-indigo-600"
              }`}
            >
              Upload research papers and get AI-powered insights and answers to your questions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`border-0 shadow-lg ${
                theme === "dark" ? "bg-slate-900/60" : "bg-white/80"
              } backdrop-blur-sm h-full`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  Upload PDF Document
                </CardTitle>
                <CardDescription>
                  Upload a research paper or document to analyze
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    theme === "dark"
                      ? "border-slate-700 hover:border-indigo-500"
                      : "border-slate-300 hover:border-indigo-500"
                  } transition-colors cursor-pointer`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf"
                  />
                  <Upload className="mx-auto h-12 w-12 mb-4 text-slate-400" />
                  <p className="mb-2 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-sm text-slate-500">PDF files only (max 10MB)</p>
                </div>

                {uploadedFileName && (
                  <div className="mt-4">
                    <p className="text-sm font-medium">Selected file:</p>
                    <div className="flex items-center gap-2 mt-1 p-2 rounded bg-slate-100 dark:bg-slate-800">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{uploadedFileName}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full mt-4"
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Question & Answer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card
              className={`border-0 shadow-lg ${
                theme === "dark" ? "bg-slate-900/60" : "bg-white/80"
              } backdrop-blur-sm h-full`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-6 w-6" />
                  Ask Questions
                </CardTitle>
                <CardDescription>
                  Ask questions about the uploaded document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Your Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Ask a question about the document..."
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleAskQuestion}
                    disabled={!uploadedFileName || !question.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Get Answer
                      </>
                    )}
                  </Button>

                  {answer && (
                    <div className="mt-4 space-y-2">
                      <Label>Answer</Label>
                      <div
                        className={`p-4 rounded-lg ${
                          theme === "dark"
                            ? "bg-indigo-950/30 border border-indigo-800"
                            : "bg-indigo-50 border border-indigo-100"
                        }`}
                      >
                        <p className="whitespace-pre-line">{answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Research;
