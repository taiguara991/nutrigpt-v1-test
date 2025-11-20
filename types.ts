
export enum ActivityLevel {
  SEDENTARY = "Sedentário (Trabalho de escritório, pouco exercício)",
  LIGHTLY_ACTIVE = "Levemente Ativo (1-3 dias/semana)",
  MODERATELY_ACTIVE = "Moderadamente Ativo (3-5 dias/semana)",
  VERY_ACTIVE = "Muito Ativo (6-7 dias/semana)",
  EXTRA_ACTIVE = "Extremamente Ativo (Trabalho físico + treino)"
}

export enum Goal {
  LOSE_WEIGHT = "Perder Peso",
  MAINTAIN = "Manter Peso",
  GAIN_MUSCLE = "Ganhar Músculo"
}

export interface UserProfile {
  age: number;
  height: number; // cm
  currentWeight: number; // kg
  targetWeight: number; // kg
  gender: 'male' | 'female' | 'other';
  region: string; // e.g., "São Paulo, Brazil", "Texas, USA"
  restrictions: string;
  preferences: string;
  activityLevel: ActivityLevel;
  goal: Goal;
}

export interface Ingredient {
  item: string;
  amount: string;
  estimatedCost?: string;
}

export interface Meal {
  name: string;
  time: string; // Novo campo de horário
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  preparationTime: string;
}

export interface WorkoutExercise {
  name: string;
  sets: string;
  reps: string;
  instructions: string;
}

export interface DailyPlan {
  date: string;
  motivationalQuote: string;
  totalCalories: number;
  macroTargets: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: Meal;
    lunch: Meal;
    snack: Meal;
    dinner: Meal;
  };
  shoppingList: Ingredient[];
  workout: {
    type: string;
    duration: string;
    exercises: WorkoutExercise[];
  };
  tips: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ProgressEntry {
  id: string;
  date: string;
  weight: number;
  waist?: number; // cm, opcional
  bmi: number;
  note?: string;
}
