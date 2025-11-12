import BackendInstance from "../instances/BackendInstance";
import { authHeader } from "../instances/getToken";

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface LocationCreateParams {
  name: string;
  address: string;
  coordinates: LocationCoordinates;
  userId: string;
  latitude: number;
  longitude: number;
  length_to_previous_location?: number | undefined;
}

export interface LocationUpdateParams {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Data {
    userId:    string;
    latitude:  number;
    longitude: number;
    address:   string;
    user:      User;
    id:        string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id:          string;
    username:    string;
    email:       string;
    phoneNumber: null;
    fullName:    string;
    gender:      null;
    location:    null;
    role:        string;
    dateOfBirth: Date;
    createdAt:   Date;
    updatedAt:   Date;
}

export interface ICreateLocationResponse {
    message: string;
    data:    Data;
}

export interface IGetLocationResponse {
    id:        string;
    userId:    string;
    latitude:  number;
    longitude: number;
    address:   string;
    createdAt: Date;
    updatedAt: Date;
    lengthToPreviousLocation: number | null;
}

export interface IGetAllLocationsResponse {
    message: string;
    data: IGetLocationResponse[];
    count: number;
}


export async function createLocation(params: LocationCreateParams) {
  return BackendInstance.post<ICreateLocationResponse>("/locations", params, { headers: authHeader() });
}

export async function getAllUserLocation() {
  return BackendInstance.get<IGetAllLocationsResponse>(`/locations`, { headers: authHeader() });
}

export async function updateLocation(id: string, params: LocationUpdateParams) {
  return BackendInstance.put<IGetLocationResponse>(`/locations/update/${id}`, params, { headers: authHeader() });
}

export async function deleteLocation(id: string) {
  return BackendInstance.delete<IGetLocationResponse>(`/locations/delete/${id}`, { headers: authHeader() });
}

export async function getLocations() {
  return BackendInstance.get<IGetLocationResponse[]>("/locations/get-locations", { headers: authHeader() });
}
