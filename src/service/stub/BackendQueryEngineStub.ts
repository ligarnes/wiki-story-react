import {BackendQueryEngine} from "../QueryEngine";

export class BackendQueryEngineStubImpl implements BackendQueryEngine {

  delete(resource: string): Promise<unknown> {
    return fetch(`/stub/delete${this.resourceUrl(resource)}.json`).then(res => res.json());
  }

  get(resource: string): Promise<unknown> {
    console.log(`/stub/get${this.resourceUrl(resource)}.json`);
    return fetch(`/stub/get${this.resourceUrl(resource)}.json`).then(res => res.json());
  }

  post(resource: string, body: unknown): Promise<unknown> {
    return fetch(`/stub/post${this.resourceUrl(resource)}.json`).then(res => res.json());
  }

  patch(resource: string, body: unknown): Promise<unknown> {
    return fetch(`/stub/patch${this.resourceUrl(resource)}.json`).then(res => res.json());
  }

  private resourceUrl(resource: string): string {
    return this.replaceAll(resource, "/", "-");
  }

  private replaceAll(str: string, search: string, replace: string): string {
    let res = str;
    while (res.includes(search)) {
      res = res.replace(search, replace);
    }
    return res;
  }
}