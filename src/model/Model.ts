export interface Page<E> {
  currentPage: number;
  totalPage: number;
  datas: Array<E>;
}