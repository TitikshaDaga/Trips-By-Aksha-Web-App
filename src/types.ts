/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BudgetEstimation {
  lodging: string;
  food: string;
  activities: string;
  transportation: string;
  currency: string;
}

export interface Activity {
  time: string; // "Morning" | "Afternoon" | "Evening"
  title: string;
  location: string;
  description: string;
  estimatedDuration: string;
  costEstimate: string;
}

export interface MealRecommendation {
  type: string; // "Breakfast" | "Lunch" | "Dinner"
  recommendation: string;
  cuisineDescription: string;
}

export interface DailyItinerary {
  dayNumber: number;
  theme: string;
  activities: Activity[];
  meals: MealRecommendation[];
}

export interface PersonalizedTrip {
  tripName: string;
  destination: string;
  durationDays: number;
  overview: string;
  highlights: string[];
  estimatedBudget: BudgetEstimation;
  packingEssentials: string[];
  localCustoms: string[];
  itinerary: DailyItinerary[];
  
  // Custom metadata added by the app
  createdAt: string;
  id: string;
  budgetTier?: string;
  travelerType?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
