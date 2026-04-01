import React, { useRef, useEffect, useState } from 'react';
import { Camera, CameraOff, ScanFace } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

const CameraProctor = ({ onViolation, socket, userEmail, examName, examId }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [error, setError] = useState(null);
    const [model, setModel] = useState(null);
    const [isDetecting, setIsDetecting] = useState(false);
    
    const isDetectingRef = useRef(false);
    
    // Tracking logic refs
    const suspiciousFrames = useRef(0);
    const violationCooldown = useRef(false);
    const analyzeInterval = useRef(null);

    // Initial Camera/Model Setup
    useEffect(() => {
        let stream = null;
        const init = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setHasPermission(true);

                await tf.ready();
                const loadedModel = await blazeface.load();
                setModel(loadedModel);
            } catch (err) {
                setError('Camera permission denied or system failed.');
                setHasPermission(false);
            }
        };

        init();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (analyzeInterval.current) clearInterval(analyzeInterval.current);
            if (streamInterval.current) clearInterval(streamInterval.current);
        };
    }, []);

    const triggerViolation = (reason) => {
        if (!onViolation || violationCooldown.current) return;
        onViolation(reason);
        violationCooldown.current = true;
        setTimeout(() => { violationCooldown.current = false; }, 10000);
    };

    const detectFace = async () => {
        if (!videoRef.current || !model || !hasPermission) return;
        if (videoRef.current.readyState !== 4) return;

        try {
            const predictions = await model.estimateFaces(videoRef.current, false);

            if (predictions.length === 0) {
                suspiciousFrames.current += 1;
                if (suspiciousFrames.current > 4) {
                    triggerViolation('Face Not Detected');
                    suspiciousFrames.current = 0;
                }
            } else if (predictions.length > 1) {
                suspiciousFrames.current += 1;
                if (suspiciousFrames.current > 3) {
                    if (onViolation) onViolation('Multiple Faces Detected', { immediateKick: true });
                    suspiciousFrames.current = 0;
                }
            } else {
                const face = predictions[0];
                const rightEye = face.landmarks[0];
                const leftEye = face.landmarks[1];
                const nose = face.landmarks[2];

                const eyeDist = Math.abs(leftEye[0] - rightEye[0]);
                const distRight = Math.abs(nose[0] - rightEye[0]);
                const distLeft = Math.abs(leftEye[0] - nose[0]);

                if (eyeDist > 0) {
                    const ratioRight = distRight / eyeDist;
                    const ratioLeft = distLeft / eyeDist;

                    if (ratioRight < 0.20 || ratioLeft < 0.20) {
                        suspiciousFrames.current += 1;
                        if (suspiciousFrames.current > 3) {
                            triggerViolation('Suspicious Head Movement (Turned Away)');
                            suspiciousFrames.current = 0;
                        }
                    } else {
                        suspiciousFrames.current = Math.max(0, suspiciousFrames.current - 1);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const streamInterval = useRef(null);

    // AI & Streaming Loops
    useEffect(() => {
        if (hasPermission && model && !isDetectingRef.current && socket && userEmail) {
            isDetectingRef.current = true;
            
            // Loop for AI Face detection
            analyzeInterval.current = setInterval(detectFace, 500); 
            
            // High-frequency stream for live monitor CCTV (~5 FPS)
            streamInterval.current = setInterval(() => {
                if (!videoRef.current || videoRef.current.readyState !== 4 || !socket) return;
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 320; 
                    canvas.height = 240;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                    
                    const frameData = canvas.toDataURL('image/jpeg', 0.5); 

                    socket.emit('video-frame', {
                        examId,
                        studentId: userEmail,
                        studentEmail: userEmail,
                        examName,
                        frame: frameData,
                        timestamp: Date.now()
                    });
                } catch (err) { }
            }, 200);
        }

        return () => {
            if (streamInterval.current) clearInterval(streamInterval.current);
            if (analyzeInterval.current) clearInterval(analyzeInterval.current);
            isDetectingRef.current = false;
        };
    }, [hasPermission, model, socket, userEmail, examName, examId]);

    return (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-200 flex items-center justify-center text-white shadow-xl relative overflow-hidden">
                    <Camera size={18} className={hasPermission ? 'text-white' : 'text-slate-500'} />
                    {hasPermission && <div className="absolute inset-0 bg-brand-500/20 animate-pulse"></div>}
                </div>
                <div>
                    <h4 className="font-black text-slate-900 text-sm italic uppercase tracking-tight">Active Security</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                        Conference protocol running
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                {!hasPermission && !error && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-amber-100">
                        <ScanFace size={12} className="animate-pulse" /> Init...
                    </span>
                )}
                {hasPermission && model && (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                        <ScanFace size={12} /> Live
                    </span>
                )}
                {error && (
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-rose-100">
                        <CameraOff size={12} /> {error.includes('denied') ? 'Denied' : 'Error'}
                    </span>
                )}
            </div>

            {/* Hidden video element absolutely required for feed scraping and TFJS analysis */}
            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="opacity-0 absolute w-[1px] h-[1px] pointer-events-none -z-50"
            />
        </div>
    );
};

export default CameraProctor;
