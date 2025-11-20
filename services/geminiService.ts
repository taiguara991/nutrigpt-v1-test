
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, DailyPlan } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = "gemini-2.5-flash";

export const generateDailyPlan = async (profile: UserProfile, previousPlan?: DailyPlan | null): Promise<DailyPlan> => {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

  let constraintText = "";
  if (previousPlan) {
    constraintText = `
      EVITE REPETIR EXATAMENTE AS MESMAS REFEIÇÕES DE ONTEM.
      Refeições anteriores para evitar:
      - Café: ${previousPlan.meals.breakfast.name}
      - Almoço: ${previousPlan.meals.lunch.name}
      - Jantar: ${previousPlan.meals.dinner.name}
      
      VARIE O TREINO TAMBÉM. Treino anterior: ${previousPlan.workout.type}
    `;
  }

  const prompt = `
    Atue como um nutricionista e personal trainer profissional brasileiro.
    Hoje é ${today}.
    Gere um cardápio de 1 dia e um treino personalizado para um usuário com o seguinte perfil:
    - Idade: ${profile.age}
    - Gênero: ${profile.gender}
    - Altura: ${profile.height}cm
    - Peso Atual: ${profile.currentWeight}kg
    - Peso Meta: ${profile.targetWeight}kg
    - Objetivo: ${profile.goal}
    - Nível de Atividade: ${profile.activityLevel}
    - Localização/Região: ${profile.region} (IMPORTANTE: Sugira refeições usando ingredientes comuns e acessíveis nesta região).
    - Restrições Alimentares: ${profile.restrictions || "Nenhuma"}
    - Preferências: ${profile.preferences || "Nenhuma"}

    CONTEXTO DE VARIEDADE:
    ${constraintText}

    Instruções:
    1. Defina horários realistas para cada refeição (Ex: 08:00, 12:30, 16:00, 20:00).
    2. Calcule o déficit ou superávit calórico necessário com base no objetivo.
    3. Crie refeições para: Café da Manhã, Almoço, Lanche da Tarde e Jantar.
    4. Crie uma lista de compras consolidada para essas refeições.
    5. Crie uma sugestão de treino para o dia.
    6. Forneça 3 dicas de saúde.
    7. Forneça uma frase motivacional.

    IDIOMA DE SAÍDA: Português do Brasil (PT-BR).
    
    IMPORTANTE: A resposta deve ser estritamente um JSON válido seguindo o esquema fornecido.
  `;

  // Define the schema with 'time' field added
  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      date: { type: Type.STRING, description: "A data de hoje formatada (ex: Segunda-feira, 24 de Outubro)" },
      motivationalQuote: { type: Type.STRING, description: "Uma frase motivacional curta" },
      totalCalories: { type: Type.NUMBER },
      macroTargets: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["protein", "carbs", "fats"]
      },
      meals: {
        type: Type.OBJECT,
        properties: {
          breakfast: {
             type: Type.OBJECT,
             properties: {
                time: { type: Type.STRING, description: "Horário sugerido (ex: 07:30)" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                preparationTime: { type: Type.STRING },
                ingredients: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING }
                        }
                    }
                }
             },
             required: ["time", "name", "calories", "ingredients"]
          },
          lunch: {
             type: Type.OBJECT,
             properties: {
                time: { type: Type.STRING, description: "Horário sugerido (ex: 12:30)" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                preparationTime: { type: Type.STRING },
                ingredients: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING }
                        }
                    }
                }
             },
             required: ["time", "name", "calories", "ingredients"]
          },
          snack: {
             type: Type.OBJECT,
             properties: {
                time: { type: Type.STRING, description: "Horário sugerido (ex: 16:00)" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                preparationTime: { type: Type.STRING },
                ingredients: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING }
                        }
                    }
                }
             },
             required: ["time", "name", "calories", "ingredients"]
          },
          dinner: {
             type: Type.OBJECT,
             properties: {
                time: { type: Type.STRING, description: "Horário sugerido (ex: 20:00)" },
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                preparationTime: { type: Type.STRING },
                ingredients: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            amount: { type: Type.STRING }
                        }
                    }
                }
             },
             required: ["time", "name", "calories", "ingredients"]
          }
        },
        required: ["breakfast", "lunch", "snack", "dinner"]
      },
      shoppingList: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                item: { type: Type.STRING },
                amount: { type: Type.STRING }
            }
        }
      },
      workout: {
        type: Type.OBJECT,
        properties: {
            type: { type: Type.STRING },
            duration: { type: Type.STRING },
            exercises: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.STRING },
                        reps: { type: Type.STRING },
                        instructions: { type: Type.STRING }
                    }
                }
            }
        }
      },
      tips: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    required: ["date", "motivationalQuote", "totalCalories", "macroTargets", "meals", "shoppingList", "workout", "tips"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as DailyPlan;
    }
    throw new Error("Nenhum dado retornado pela IA");

  } catch (error) {
    console.error("Erro ao gerar plano:", error);
    throw error;
  }
};

export const askNutri = async (profile: UserProfile, plan: DailyPlan | null, question: string): Promise<string> => {
    const prompt = `
      Atue como um nutricionista amigável e brasileiro.
      
      CONTEXTO DO USUÁRIO:
      - Nome: ${profile.gender === 'male' ? 'Usuário' : 'Usuária'}
      - Objetivo: ${profile.goal}
      - Dieta atual: ${plan ? 'Usuário tem um plano gerado para hoje com ' + plan.totalCalories + ' calorias.' : 'Usuário ainda não gerou o plano de hoje.'}
      
      PERGUNTA DO USUÁRIO:
      "${question}"
      
      Responda de forma direta, útil e curta (máximo 3 frases).
      Responda SEMPRE em Português do Brasil.
    `;
  
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
  
      return response.text || "Desculpe, não consegui formular uma resposta agora.";
    } catch (error) {
      console.error("Erro no chat:", error);
      return "Tive um problema ao consultar o nutricionista. Tente novamente.";
    }
  };
