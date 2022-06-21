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
  getNewSquenceNumber(newData: IPersonData[], newIndex: number) {
    let prevSequenceNumber = newData[newIndex - 1]?.sequence;
    let nextSequenceNumber = newData[newIndex + 1]?.sequence;
    let currSequenceNumber;

    if (prevSequenceNumber === undefined) {
      currSequenceNumber = Math.floor(
        nextSequenceNumber - nextSequenceNumber / 2
      );
    } else if (nextSequenceNumber === undefined) {
      currSequenceNumber = Math.floor(
        prevSequenceNumber + prevSequenceNumber / 2
      );
    } else {
      currSequenceNumber = Math.floor(
        (prevSequenceNumber + nextSequenceNumber) / 2
      );
    }
    return currSequenceNumber;
  }
  reorderPeopleSequence(
    currSequenceNumber: number,
    prevSequenceNumber?: number,
    nextSequenceNumber?: number
  ): boolean {
    return (
      Math.abs(currSequenceNumber - prevSequenceNumber!) <= 1 ||
      Math.abs(currSequenceNumber - nextSequenceNumber!) <= 1
    );
  }
}
export default new PeopleDataService();
