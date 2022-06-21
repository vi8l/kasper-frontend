import http from "../utils/http-common";
import IPersonData from "../types/person.type";
class PeopleDataService {
  getAll() {
    return http.get<Array<IPersonData>>("/people");
  }
  get(id: string) {
    return http.get<IPersonData>(`/people/${id}`);
  }
  create(data: { [key: string]: any }) {
    return http.post<any>("/people", data);
  }
  update(data: IPersonData, id: any) {
    return http.put<any>(`/people/${id}`, data);
  }
  updateOrder(data: { [key: string]: any }, id: any) {
    return http.put<any>(`/people/sequence/${id}`, data);
  }
  delete(id: number) {
    return http.delete<any>(`/people/${id}`);
  }
}
export default new PeopleDataService();
