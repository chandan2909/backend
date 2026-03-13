const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testController() {
  const apiKey = 'AIzaSyDlmlXlQszGgVPJXBOJHltmPZkYHKdsEtM';
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const history = [
    { role: 'assistant', content: 'Welcome to Kodemy!' },
    { role: 'user', content: 'What is JS?' }
  ];
  const message = 'Explain in 1 sentence.';

  const formattedHistory = [];
  const validHistory = history.filter(m => m.content && m.content.trim() !== '');
  
  for (let i = 0; i < validHistory.length; i++) {
    const m = validHistory[i];
    if (i === 0 && m.role !== 'user') {
      console.log('Skipping initial assistant message:', m.role);
      continue;
    }
    formattedHistory.push({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    });
  }

  console.log('Formatted History:', JSON.stringify(formattedHistory, null, 2));

  try {
    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: 'You are Kodemy AI Assistant, a helpful learning assistant.'
    });

    console.log('Sending message:', message);
    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      console.log('CHUNK:', chunk.text());
    }
    console.log('DONE');
  } catch (error) {
    console.error('ERROR:', error.message);
  }
}

testController();
