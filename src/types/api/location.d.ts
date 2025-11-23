declare interface ILocationCoordinates {
  lat: number;
  lng: number;
}

declare interface ILocationCreateParams {
  name: string;
  address: string;
  coordinates: ILocationCoordinates;
  userId: string;
  latitude: number;
  longitude: number;
  length_to_previous_location?: number | undefined;
}

declare interface ILocationUpdateParams {
  latitude: number;
  longitude: number;
  address: string;
}

declare interface ICreateLocationResponseData {
    userId:    string;
    latitude:  number;
    longitude: number;
    address:   string;
    user:      IUser;
    id:        string;
    createdAt: Date;
    updatedAt: Date;
}

declare interface User {
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

declare interface ICreateLocationResponse {
    message: string;
    data:    ICreateLocationResponseData;
}

declare interface IGetLocationResponse {
    id:        string;
    userId:    string;
    latitude:  number;
    longitude: number;
    address:   string;
    createdAt: Date;
    updatedAt: Date;
    lengthToPreviousLocation: number | null;
}

declare interface IGetAllLocationsResponse {
    message: string;
    data: IGetLocationResponse[];
    count: number;
}