// models/UserModel.ts

export interface UserModel {
    id: string; // Unique identifier for the user
    name: string; // Name of the user
    email: string; // Email address of the user
    createdAt: string; // ISO 8601 timestamp for when the user was created
    updatedAt?: string; // ISO 8601 timestamp for when the user was last updated
    eventsCreated?: string[]; // List of event IDs the user has created
    eventsParticipated?: string[]; // List of event IDs the user has participated in
  }
  