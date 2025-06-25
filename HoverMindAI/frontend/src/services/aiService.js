const API_BASE_URL = 'http://localhost:5000';

export const aiService = {
  async processVoiceCommand(audioBlob) {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      const response = await fetch(`${API_BASE_URL}/api/ai`, {
        method: 'POST',
        body: formData,
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw error;
    }
  },

  async processTextCommand(text) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: text,
          context: window.location.href 
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error processing text command:', error);
      throw error;
    }
  },

  async generateTestScript(description) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test-script`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          element: description,
          type: 'auto'
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error generating test script:', error);
      throw error;
    }
  }
}; 