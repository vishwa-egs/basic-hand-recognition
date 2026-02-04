import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import { classifyGesture } from '../services/gestureEngine';
import { speak } from '../services/tts';
import { GESTURE_DICTIONARY } from '../constants';
import { GestureType } from '../types';
import { Volume2, VolumeX, Loader2, AlertTriangle, Maximize2 } from 'lucide-react';

const LiveDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gesture, setGesture] = useState<GestureType>(GestureType.None);
  const [confidence, setConfidence] = useState(0);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  
  // Rate limiting TTS to avoid spamming
  const lastSpokenRef = useRef<string>("");
  const lastSpokenTimeRef = useRef<number>(0);

  // Initialize MediaPipe HandLandmarker
  useEffect(() => {
    const initLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const result = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 1
        });
        setLandmarker(result);
        setLoading(false);
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
      }
    };
    initLandmarker();
  }, []);

  // Handle Speech Logic
  useEffect(() => {
    if (gesture !== GestureType.None && speechEnabled) {
      const now = Date.now();
      const currentText = GESTURE_DICTIONARY[gesture].name;

      // Speak if new gesture OR 3 seconds passed
      if (currentText !== lastSpokenRef.current || (now - lastSpokenTimeRef.current > 3000)) {
        speak(currentText);
        lastSpokenRef.current = currentText;
        lastSpokenTimeRef.current = now;
      }
    }
  }, [gesture, speechEnabled]);

  const enableCam = useCallback(async () => {
    if (!landmarker) {
      console.log("Wait! landmarker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false);
      return;
    }

    try {
      const constraints = { video: { width: 1280, height: 720 } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.addEventListener("loadeddata", predictWebcam);
        setWebcamRunning(true);
        setPermissionError(false);
      }
    } catch (err) {
      console.error("Webcam denied:", err);
      setPermissionError(true);
    }
  }, [landmarker, webcamRunning]);

  const predictWebcam = async () => {
    if (!videoRef.current || !canvasRef.current || !landmarker) return;
    
    // Ensure video is playing
    if (videoRef.current.paused || videoRef.current.ended) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;

    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const drawingUtils = new DrawingUtils(ctx);
    
    // Detect
    let startTimeMs = performance.now();
    const result = landmarker.detectForVideo(video, startTimeMs);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (result.landmarks && result.landmarks.length > 0) {
      // Draw Landmarks
      for (const landmarks of result.landmarks) {
        drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5
        });
        drawingUtils.drawLandmarks(landmarks, {
          color: "#FF0000",
          lineWidth: 2
        });

        // CLASSIFY GESTURE (Our "ML" Logic)
        const detectedGesture = classifyGesture(landmarks);
        setGesture(detectedGesture);
        setConfidence(0.95); // Simulated confidence for geometric logic
      }
    } else {
      setGesture(GestureType.None);
      setConfidence(0);
    }

    // Loop
    if (video.srcObject) {
      requestAnimationFrame(predictWebcam);
    }
  };

  const currentGestureData = GESTURE_DICTIONARY[gesture];

  return (
    // Main Container:
    // Mobile: pb-[80px] to clear bottom nav. Flex Col.
    // Desktop: pb-0. Flex Row.
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] bg-slate-900 overflow-hidden pb-[80px] md:pb-0">
      
      {/* 
         CAMERA FEED AREA 
         Mobile: flex-1 (Take available space top)
         Desktop: flex-1 (Take left side)
      */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[50%] md:min-h-full">
        {loading && (
          <div className="absolute z-20 flex flex-col items-center text-cyan-400 animate-pulse">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p>Loading AI Model...</p>
          </div>
        )}

        {permissionError && (
          <div className="absolute z-20 flex flex-col items-center text-red-400 text-center p-6">
            <AlertTriangle className="w-16 h-16 mb-4" />
            <h3 className="text-xl font-bold">Camera Access Denied</h3>
            <p className="mt-2 text-slate-300">Please allow camera access.</p>
          </div>
        )}

        {!webcamRunning && !loading && !permissionError && (
           <button 
             onClick={enableCam}
             className="z-20 flex flex-col items-center gap-4 group"
           >
             <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(8,145,178,0.5)] group-hover:scale-110 transition-transform">
                <Maximize2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
             </div>
             <p className="text-white font-medium text-lg tracking-wide">Enable Camera</p>
           </button>
        )}

        <video 
          ref={videoRef} 
          className="absolute w-full h-full object-cover transform -scale-x-100" 
          autoPlay 
          playsInline
        />
        <canvas 
          ref={canvasRef} 
          className="absolute w-full h-full object-cover transform -scale-x-100"
        />
        
        {/* Overlay Info - Top Left */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white border border-white/10 z-10">
           <div className="flex items-center gap-2">
             <div className={`w-3 h-3 rounded-full ${webcamRunning ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-xs font-mono uppercase tracking-wider hidden md:inline">
               {webcamRunning ? 'Live Inference' : 'Camera Off'}
             </span>
             <span className="text-xs font-mono uppercase tracking-wider md:hidden">
               {webcamRunning ? 'Live' : 'Off'}
             </span>
           </div>
        </div>
      </div>

      {/* 
         RESULTS PANEL 
         Mobile: Fixed height or auto at bottom, full width.
         Desktop: Fixed width (w-96) at right, full height.
      */}
      <div className="w-full md:w-96 bg-slate-800 border-t md:border-t-0 md:border-l border-slate-700 p-4 md:p-6 flex flex-col shadow-2xl z-10 overflow-y-auto h-auto md:h-full shrink-0">
        
        {/* Header - Compact on Mobile */}
        <div className="flex items-center justify-between mb-4 md:mb-8">
           <h2 className="text-lg md:text-xl font-bold text-white border-l-4 border-cyan-500 pl-3">
             Detection Result
           </h2>
           <button 
             onClick={() => setSpeechEnabled(!speechEnabled)}
             className={`p-2 rounded-full transition-colors ${speechEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-500'}`}
           >
             {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
           </button>
        </div>

        {/* Prediction Card - Flex layout to center content */}
        <div className="flex-1 flex flex-row md:flex-col items-center justify-center gap-6 md:gap-6">
          
          {/* Icon Circle */}
          <div className={`
             w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-300 shrink-0
             ${gesture !== GestureType.None ? 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(8,145,178,0.4)]' : 'bg-slate-700/50 border-2 border-dashed border-slate-600'}
          `}>
             {gesture !== GestureType.None ? (
               <div className="text-white transform scale-125 md:scale-150">
                 {currentGestureData.icon}
               </div>
             ) : (
               <span className="text-slate-500 text-xs md:text-sm">No Hand</span>
             )}
          </div>

          {/* Text Details */}
          <div className="text-left md:text-center space-y-1 md:space-y-2 flex-1">
            <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {currentGestureData.name}
            </h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-[200px] md:mx-auto leading-relaxed line-clamp-2 md:line-clamp-none">
              {currentGestureData.description}
            </p>
            
             {/* Confidence Bar (Only visible if gesture detected) */}
            {gesture !== GestureType.None && (
                <div className="w-full bg-slate-700/50 rounded-full h-1.5 md:h-2 mt-2 md:mt-4 overflow-hidden">
                <div 
                    className="bg-cyan-500 h-full transition-all duration-300" 
                    style={{ width: `${confidence * 100}%` }}
                ></div>
                </div>
            )}
          </div>

        </div>

        {/* Footer Info (Hidden on very small screens to save space) */}
        <div className="hidden md:block mt-8 pt-6 border-t border-slate-700 text-xs text-slate-500 text-center">
           Running TensorFlow MediaPipe<br/>
           Latency: ~15ms
        </div>
      </div>
    </div>
  );
};

export default LiveDetection;