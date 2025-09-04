
import { Timestamp } from 'firebase/firestore';

export interface Service {
  id: string;
  name: string;
  category: string;
  type: 'base' | 'add-on';
  price: number;
  duration: number; // in minutes
  dependsOn?: string;
  notes?: string;
  order: number;
  visible: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  bufferMinutes?: number;
}

export interface Availability {
  date: string; // YYYY-MM-DD
  slots: string[]; // 'HH:MM'
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  services: Array<{id:string,name:string,price:number,duration:number}>;
  bookingDate: string; // 'YYYY-MM-DD'
  bookingTime: string; // 'HH:MM'
  totalPrice: number;
  totalDuration: number;
  styleRequests?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface OutOfHoursRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  services: Booking['services'];
  totalPrice: number;
  totalDuration: number;
  requestedDate: string; // 'YYYY-MM-DD'
  requestedTime: string; // 'HH:MM'
  clientNotes?: string | null;
  status: 'pending' | 'approved' | 'denied';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WaitingListEntry {
  id: string;
  clientId: string;
  clientName: string;
  email: string;
  date: string; // 'YYYY-MM-DD'
  notes?: string;
  createdAt: Timestamp;
}

export interface Client {
  uid: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  notes?: Array<{ text:string, timestamp:Timestamp }>;
}
