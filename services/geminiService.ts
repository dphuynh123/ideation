import { GoogleGenAI, Type } from "@google/genai";
import type { MindMapData, UserInput } from '../types';

// IMPORTANT: Do not expose this key publicly.
// It's assumed that `process.env.API_KEY` is securely managed in the deployment environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to show a more user-friendly error
  // or disable the feature if the key is not available.
  console.error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const mindMapSchema = {
  type: Type.OBJECT,
  properties: {
    centralTopic: {
      type: Type.STRING,
      description: 'A concise central theme based on the user\'s input.'
    },
    problems: {
      type: Type.ARRAY,
      description: 'An array of 3 to 4 distinct problems related to the central topic.',
      items: {
        type: Type.OBJECT,
        properties: {
          problemTitle: {
            type: Type.STRING,
            description: 'A clear and concise title for the identified problem.'
          },
          businessIdeas: {
            type: Type.ARRAY,
            description: 'An array of 2 to 3 innovative business ideas that solve this specific problem.',
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'A catchy and descriptive title for the business idea.'
                },
                description: {
                  type: Type.STRING,
                  description: 'A brief, one-sentence description of the business idea.'
                }
              },
              required: ['title', 'description']
            }
          }
        },
        required: ['problemTitle', 'businessIdeas']
      }
    }
  },
  required: ['centralTopic', 'problems']
};

const createPrompt = (userInput: UserInput, language: 'en' | 'vi'): string => {
  const { interests, skills, marketTrends } = userInput;

  const promptLabels = language === 'vi' ? {
      analyze: 'Phân tích hồ sơ người dùng sau đây để tạo sơ đồ tư duy ý tưởng kinh doanh. Tập trung vào việc xác định các vấn đề hữu hình và hình thành các giải pháp kinh doanh sáng tạo.',
      profile: 'Hồ sơ người dùng:',
      interests: 'Sở thích & Đam mê',
      skills: 'Kỹ năng & Chuyên môn',
      trends: 'Xu hướng thị trường quan sát được',
      notProvided: 'Không cung cấp',
      instruction: 'Dựa trên hồ sơ này, vui lòng tạo một sơ đồ tư duy có cấu trúc. Bắt đầu với một chủ đề trung tâm tổng hợp các thông tin đầu vào của người dùng. Sau đó, xác định 3-4 vấn đề riêng biệt trong chủ đề đó. Đối với mỗi vấn đề, hãy động não 2-3 ý tưởng kinh doanh độc đáo đóng vai trò là giải pháp.',
      outputFormat: 'Đầu ra phải là một đối tượng JSON hợp lệ khớp với lược đồ được cung cấp.',
      languageInstruction: 'Toàn bộ đầu ra, bao gồm tất cả các chủ đề, tiêu đề và mô tả, phải bằng tiếng Việt.'
  } : {
      analyze: 'Analyze the following user profile to generate a business idea mindmap. Focus on identifying tangible problems and conceiving innovative business solutions.',
      profile: 'User Profile:',
      interests: 'Interests & Passions',
      skills: 'Skills & Expertise',
      trends: 'Observed Market Trends',
      notProvided: 'Not provided',
      instruction: 'Based on this profile, please generate a structured mindmap. Start with a central topic that synthesizes the user\'s inputs. Then, identify 3-4 distinct problems within that topic. For each problem, brainstorm 2-3 unique business ideas that act as solutions.',
      outputFormat: 'The output must be a valid JSON object matching the provided schema.',
      languageInstruction: ''
  };

  let prompt = `${promptLabels.analyze}

  ${promptLabels.profile}
  - ${promptLabels.interests}: ${interests || promptLabels.notProvided}
  - ${promptLabels.skills}: ${skills || promptLabels.notProvided}
  - ${promptLabels.trends}: ${marketTrends || promptLabels.notProvided}

  ${promptLabels.instruction}
  
  ${promptLabels.outputFormat}
  ${promptLabels.languageInstruction}
  `;

  return prompt.trim();
};


export const generateBusinessMindMap = async (userInput: UserInput, language: 'en' | 'vi'): Promise<MindMapData> => {
  if (!API_KEY) {
    throw new Error("API key is not configured. Please contact support.");
  }

  const prompt = createPrompt(userInput, language);

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mindMapSchema,
            temperature: 0.8,
            topP: 0.95,
        },
    });

    const jsonText = response.text;
    if (!jsonText) {
        throw new Error("Received an empty response from the API.");
    }
    
    // The response text should already be a valid JSON string
    return JSON.parse(jsonText) as MindMapData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if(error instanceof Error && error.message.includes('json')){
        throw new Error("Failed to generate a valid mindmap structure. The AI's response was not in the expected format. Please try again with a different input.");
    }
    throw new Error("An error occurred while generating business ideas. Please check your connection and API key.");
  }
};
