import http from "../utils/http-common";
import IPersonData from "../types/person.type"
class PeopleDataService {
  getAll() {
    return http.get<Array<IPersonData>>("/people");
  }
  get(id: string) {
    return http.get<IPersonData>(`/people/${id}`);
  }
  create(data: IPersonData) {
    return http.post<IPersonData>("/people", data);
  }
  update(data: IPersonData, id: any) {
    return http.put<any>(`/people/${id}`, data);
  }
  delete(id: any) {
    return http.delete<any>(`/people/${id}`);
  }
}
export default new PeopleDataService();