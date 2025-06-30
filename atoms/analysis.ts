import { atom } from 'jotai';

export interface FoodAnalysis {
  identifiedFood: string;
  image?: string;
  portionSize: string;
  recognizedServingSize: string;
  nutritionFactsPerPortion: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
    cholesterol: string;
  };
  nutritionFactsPer100g: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    sugar: string;
    sodium: string;
    cholesterol: string;
  };
  additionalNotes: string[];
}

export const analysisAtom = atom<FoodAnalysis | null>(null);