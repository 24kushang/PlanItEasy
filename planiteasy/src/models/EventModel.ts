// models/EventModel.ts

export interface EventModel {
    id: string; // Unique identifier for the event
    name: string; // Name of the event
    description?: string; // Optional description of the event
    date: string; // ISO 8601 format date (e.g., "2024-12-01T15:00:00Z")
    location: string; // Location of the event
    createdBy: string; // User ID of the creator
    participants?: number; // Expected number of Participants
    createdAt: string;
    updatedAt: string;
  }
  