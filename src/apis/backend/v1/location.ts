import BackendInstance from "../../instances/BackendInstance";
import { authHeader } from "../../instances/getToken";

export async function createLocation(params: ILocationCreateParams) {
  return BackendInstance
    .post<ICreateLocationResponse>("/locations", params,
      { headers: authHeader() }
    );
}

export async function getAllUserLocation() {
  return BackendInstance
  .get<IGetAllLocationsResponse>(`/locations`, 
    { headers: authHeader() }
  );
}

export async function updateLocation(id: string, params: ILocationUpdateParams) {
  return BackendInstance
  .put<IGetLocationResponse>(`/locations/update/${id}`, params, 
    { headers: authHeader() }
  );
}

export async function deleteLocation(id: string) {
  return BackendInstance
  .delete<IGetLocationResponse>(`/locations/delete/${id}`, 
    { headers: authHeader() }
  );
}

export async function getLocations() {  
  return BackendInstance
  .get<IGetLocationResponse[]>("/locations/get-locations", 
    { headers: authHeader() }
  );
}
