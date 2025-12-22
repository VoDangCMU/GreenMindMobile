import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

// Types based on OpenAPI spec for Checkin
export interface ICheckinUser {
  id: string;
  username: string;
  email: string;
  phoneNumber: string | null;
  fullName: string;
  gender: string;
  location: string;
  region: string;
  role: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}

// Detailed checkin returned by create endpoint
export interface ICheckinDetail {
  latitude: number;
  longitude: number;
  location: string;
  user: ICheckinUser;
  id: string;
  createdAt: string;
  updatedAt: string;
}

// List item returned by get-checkins (latitude/longitude as strings in example)
export interface ICheckinListItem {
  id: string;
  latitude: string;
  longitude: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateCheckinPayload {
  location: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
}

export interface ICreateCheckinResponse {
  message: string;
  checkin: ICheckinDetail;
}

export async function createCheckin(payload: ICreateCheckinPayload) {
  const res = await BackendInstance.post<ICreateCheckinResponse>(`/checkins/create-checkin`, payload, { headers: authHeader() });
  return res.data;
}

export interface IGetCheckinsResponse {
  message: string;
  data: {
    checkins: ICheckinListItem[];
  };
}

export async function getCheckins() {
  const res = await BackendInstance.get<IGetCheckinsResponse>(`/checkins/get-checkins`, { headers: authHeader() });
  return res.data;
}

export interface IUpdateCheckinResponse {
  message: string;
}

export async function updateCheckin(id: string, payload: Record<string, any>) {
  const res = await BackendInstance.put<IUpdateCheckinResponse>(`/checkins/update-checkin/${id}`, payload, { headers: authHeader() });
  return res.data;
}

export interface IDeleteCheckinResponse {
  message: string;
}

export async function deleteCheckin(id: string) {
  const res = await BackendInstance.delete<IDeleteCheckinResponse>(`/checkins/delete-checkin/${id}`, { headers: authHeader() });
  return res.data;
}
