import BackendInstance from "@/apis/instances/BackendInstance";
import { authHeader } from "@/apis/instances/getToken";

export interface GetLattestLocationResponse {
  message: string
  data: GetLattestLocationResponseData
}

export interface GetLattestLocationResponseData {
  id: string
  userId: string
  latitude: number
  longitude: number
  address: string
  lengthToPreviousLocation: number
  createdAt: string
  updatedAt: string
}

export async function getLatestLocation() {
    const res = await BackendInstance.get<GetLattestLocationResponse>(`/locations/latest`, { headers: authHeader() })
    return res.data;
}

export interface IGetDistanceTodayResponse {
  message: string
  data: IGetDistanceTodayResponseData
}

export interface IGetDistanceTodayResponseData {
  total_distance: number
  user: User
}

export interface User {
  id: string
  username: string
  email: string
  phoneNumber: any
  fullName: string
  gender: string
  location: string
  role: string
  dateOfBirth: string
  createdAt: string
  updatedAt: string
}

export async function getDistanceToday() {
    const res = await BackendInstance.get<IGetDistanceTodayResponse>(`/locations/distanceToday`, { headers: authHeader() })
    return res.data;
}