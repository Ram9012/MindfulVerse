import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { api } from "@/lib/api";
import { motion } from "framer-motion";

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: any) => void;
  onError?: (error: string) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete, onError }) => {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [visualizerValues, setVisualizerValues] = useState<number[]>(Array(20).fill(5));
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Set up audio recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for visualizer
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;
      
      // Start visualizer animation
      const updateVisualizer = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Get average levels for visualization
        const values = Array(20).fill(0);
        const segmentLength = Math.floor(dataArrayRef.current.length / 20);
        
        for (let i = 0; i < 20; i++) {
          let sum = 0;
          for (let j = 0; j < segmentLength; j++) {
            sum += dataArrayRef.current[i * segmentLength + j];
          }
          // Scale value between 5 and 50 for visualization
          values[i] = 5 + Math.floor((sum / segmentLength) * 0.18);
        }
        
        setVisualizerValues(values);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };
      
      animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      
      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
        
        // Stop visualizer
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Error starting recording:", error);
      if (onError) onError("Could not access microphone. Please check permissions.");
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const processRecording = async () => {
    if (!audioBlob) return;
    
    setIsProcessing(true);
    setProcessingStage('Preparing audio data');
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        try {
          const base64Audio = reader.result as string;
          
          // First, transcribe the audio using Gemini 1.5 Pro via the API service
          setProcessingStage('Transcribing audio with Gemini 1.5 Pro...');
          console.log('Starting audio transcription with Gemini 1.5 Pro...');
          const transcriptionData = await api.transcribeAudio(base64Audio);
          console.log('Transcription complete:', transcriptionData);
          
          // After transcription, indicate that we're analyzing the transcript
          setProcessingStage('Analyzing transcript with classification model...');
          
          // Check if the transcription was successful
          if (!transcriptionData) {
            throw new Error('Failed to transcribe audio: No response received');
          }
          
          if (transcriptionData.error) {
            throw new Error(`Failed to transcribe audio: ${transcriptionData.error}`);
          }
          
          // The backend now returns a complete analysis result directly from the transcribe-audio endpoint
          // We don't need to call analyzeTranscript separately anymore
          
          // Log the full response to help with debugging
          console.log('Full transcription response from Gemini 1.5 Pro:', JSON.stringify(transcriptionData, null, 2));
          
          // Validate the response has the required data
          if (!transcriptionData.structured_transcript && !transcriptionData.transcript) {
            console.error('Incomplete response - missing transcript data:', transcriptionData);
            throw new Error('Failed to process audio: No transcript data in response');
          }
          
          // The backend should provide structured_transcript, but we'll check for both formats
          if (!transcriptionData.sessionMeta) {
            console.warn('Response missing sessionMeta, will create one:', transcriptionData);
          }
          
          // Make sure we're using the actual processed data
          setProcessingStage('Preparing results display');
          console.log('Preparing analysis data for display');
          
          // Create a session ID with timestamp to ensure uniqueness
          const sessionId = `audio-recording-session-${Date.now()}`;
          
          // Make sure the analysis data has the correct session ID
          if (transcriptionData.sessionMeta) {
            transcriptionData.sessionMeta.sessionId = sessionId;
          } else {
            // If sessionMeta is missing, create it
            transcriptionData.sessionMeta = {
              sessionId: sessionId,
              patientId: `patient-${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              summary: "Audio recording session analysis"
            };
          }
          
          // Call the callback with the transcription data (which now includes the analysis)
          onTranscriptionComplete(transcriptionData);
          
          // Reset state
          setAudioBlob(null);
          setRecordingTime(0);
          setProcessingStage('');
          setIsProcessing(false);
        } catch (error) {
          console.error('Error in audio processing:', error);
          
          // Provide more specific error messages based on the error type
          let errorMessage = '';
          if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            errorMessage = 'Connection to the backend server failed. Please make sure the backend server is running on port 5001. Run the start_backend.bat file to start the server.';
          } else if (error instanceof Error && error.message.includes('Invalid response format')) {
            errorMessage = 'Failed to process audio. This might be due to a missing or invalid Gemini API key. Please check the BACKEND_SETUP.md file for instructions on setting up your API key.';
          } else if (error instanceof Error && error.message.includes('Gemini models not initialized')) {
            errorMessage = 'The Gemini AI service is not properly configured. Please check your API key in the .env file and restart the backend server.';
          } else {
            errorMessage = `Error processing recording: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
          
          // Add helpful guidance
          errorMessage += '\n\nTroubleshooting steps:\n1. Make sure the backend server is running (start_backend.bat)\n2. Check that you have a valid Gemini API key in the .env file\n3. Restart the backend server after making changes';
          
          if (onError) onError(errorMessage);
          setIsProcessing(false);
          setProcessingStage('');
        }
      };
    } catch (error) {
      console.error("Error processing recording:", error);
      if (onError) onError("Error processing recording. Please try again.");
      setProcessingStage('');
      setIsProcessing(false);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card className={`border-0 shadow-lg ${theme === 'dark' ? 'bg-slate-900/60' : 'bg-white/80'} backdrop-blur-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Mic className={`h-5 w-5 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <CardTitle>Voice Recording</CardTitle>
        </div>
        <CardDescription>Record therapy session for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-6">
          {/* Audio Visualizer */}
          <div className="w-full h-16 flex items-center justify-center">
            {isRecording ? (
              <div className="flex items-end justify-center w-full h-full space-x-1">
                {visualizerValues.map((value, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 rounded-t-sm ${theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'}`}
                    style={{ height: `${value}%` }}
                    initial={{ height: '5%' }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.1 }}
                  />
                ))}
              </div>
            ) : audioBlob ? (
              <div className="text-center">
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Recording complete - {formatTime(recordingTime)}
                </p>
                <audio className="mt-2" controls src={URL.createObjectURL(audioBlob)} />
              </div>
            ) : (
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Press record to start capturing audio
              </p>
            )}
          </div>
          
          {/* Recording Time */}
          {isRecording && (
            <div className={`text-xl font-semibold ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700'}`}>
              {formatTime(recordingTime)}
            </div>
          )}
          
          {/* Controls */}
          <div className="flex space-x-4">
            {!isRecording && !audioBlob && (
              <Button 
                onClick={startRecording}
                className={`${theme === 'dark' ? 'bg-indigo-700 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button 
                onClick={stopRecording}
                variant="destructive"
              >
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            
            {audioBlob && !isProcessing && (
              <Button 
                onClick={processRecording}
                className={`${theme === 'dark' ? 'bg-green-700 hover:bg-green-600' : 'bg-green-600 hover:bg-green-700'}`}
              >
                Process Recording
              </Button>
            )}
            
            {isProcessing && (
              <div className="flex flex-col items-center">
                <Button disabled className="mb-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </Button>
                {processingStage && (
                  <p className={`text-sm ${theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    {processingStage}
                  </p>
                )}
              </div>
            )}
            
            {audioBlob && !isProcessing && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setAudioBlob(null);
                  setRecordingTime(0);
                }}
              >
                Discard
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
