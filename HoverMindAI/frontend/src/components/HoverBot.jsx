import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import { domManipulator } from '../utils/domManipulator';
import '../styles/HoverBot.css';

const HoverBot = () => {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isListening, setIsListening] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textCommand, setTextCommand] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const botRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        
        try {
          setIsProcessing(true);
          const response = await aiService.processVoiceCommand(audioBlob);
          handleAIResponse(response);
        } catch (error) {
          console.error('Error processing voice command:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsListening(false);
    }
  };

  const handleVoiceButton = () => {
    if (isListening) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  const handleTextButton = () => {
    setShowTextInput(!showTextInput);
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textCommand.trim()) return;

    try {
      setIsProcessing(true);
      const response = await aiService.processTextCommand(textCommand);
      handleAIResponse(response);
      setTextCommand('');
    } catch (error) {
      console.error('Error processing text command:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAIResponse = (response) => {
    if (response.error) {
      console.error('Server error:', response.error);
      return;
    }

    if (response.answer) {
      try {
        // Try to parse the answer as JSON in case it contains DOM manipulation instructions
        const instructions = JSON.parse(response.answer);
        if (instructions.action === 'modify_dom') {
          const { selector, properties } = instructions;
          const element = domManipulator.findElement(selector);
          if (element) {
            domManipulator.modifyElement(element, properties);
          }
        }
      } catch (e) {
        // If not JSON, treat it as a regular text response
        console.log('AI Response:', response.answer);
      }
    } else if (response.script) {
      console.log('Generated test script:', response.script);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, [isDragging, offset]);

  return (
    <div
      ref={botRef}
      className="hover-bot"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="bot-face">
        <div className="bot-eyes">
          <div className="eye"></div>
          <div className="eye"></div>
        </div>
        <div className="bot-mouth"></div>
      </div>
      <div className="bot-controls">
        <button 
          className={`bot-button ${isListening ? 'active' : ''}`} 
          onClick={handleVoiceButton}
          disabled={isProcessing}
        >
          {isListening ? '⏹️' : '🎤'}
        </button>
        <button 
          className={`bot-button ${showTextInput ? 'active' : ''}`} 
          onClick={handleTextButton}
          disabled={isProcessing}
        >
          💬
        </button>
        <button className="bot-button" disabled={isProcessing}>🎨</button>
      </div>
      {showTextInput && (
        <form onSubmit={handleTextSubmit} className="text-input-form">
          <input
            type="text"
            value={textCommand}
            onChange={(e) => setTextCommand(e.target.value)}
            placeholder="Enter command..."
            disabled={isProcessing}
          />
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? '⏳' : '➤'}
          </button>
        </form>
      )}
      {isProcessing && <div className="processing-indicator">Processing...</div>}
    </div>
  );
};

export default HoverBot; 