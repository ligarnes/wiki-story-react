import {JwtHelper, JwtToken} from "./user/JwtUtils";

interface QueryError {
  message: string;
}

export class RequestException extends Error {
  private readonly _errorCode: number;

  constructor(m: string, errorCode: number) {
    super(m);
    this._errorCode = errorCode;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RequestException.prototype);
  }

  get errorCode(): number {
    return this._errorCode;
  }
}

class AuthorizationError extends Error {
  constructor(m: string) {
    super(m);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export interface BackendQueryEngine {
  get: (resource: string) => Promise<unknown>;
  delete: (resource: string) => Promise<unknown>;
  post: (resource: string, body: unknown) => Promise<unknown>;
  patch: (resource: string, body: unknown) => Promise<unknown>;
  put: (resource: string, body: unknown) => Promise<unknown>;
}

export class QueryEngineImpl implements BackendQueryEngine {

  private readonly serverUrl: string;

  constructor(backendUrl: string) {
    this.serverUrl = backendUrl;
  }

  private requestInfo(method: string, body?: any): RequestInit {
    const authToken = this.getToken();
    const headers: any = {'Content-Type': 'application/json'};
    if (authToken !== null) {
      headers.Authorization = 'Bearer ' + authToken;
    }

    let bodyJson: string | null = null;
    if (body) {
      bodyJson = JSON.stringify(body);
    }

    return {
      method: method,
      headers: headers,
      body: bodyJson
    };
  }

  get = (resource: string): Promise<unknown> => {
    return this.query(resource, this.requestInfo('GET'));
  };

  delete = (resource: string): Promise<unknown> => {
    return this.query(resource, this.requestInfo('DELETE'));
  };

  post = (resource: string, body: unknown): Promise<unknown> => {
    return this.query(resource, this.requestInfo('POST', body));
  };

  patch = (resource: string, body: unknown): Promise<unknown> => {
    return this.query(resource, this.requestInfo('PATCH', body));
  };

  put = (resource: string, body: unknown): Promise<unknown> => {
    return this.query(resource, this.requestInfo('PUT', body));
  };

  private query = (resource: string, init: RequestInit): Promise<any> => {
    return fetch(this.serverUrl + resource, init)
      .then(this.handleResponse)
      .then(this.parseResponse);
  };

  private parseResponse = async (response: Response): Promise<any> => {
    if (response.status === 204) {
      return null;
    }
    if (response.headers.get("Content-Type") === "application/json") {
      return this.parseJson(response);
    } else {
      return response.text();
    }
  }

  private handleResponse = async (response: Response) => {
    if (!response.ok) {
      if (response.status === 401) {
        window.sessionStorage.removeItem('user-token');
        document.location.href = "/login";
      } else if (response.status === 403) {
        throw new AuthorizationError("You don't have access to this data");
      } else if (response.status === 501) {
        throw new RequestException(`Function [${response.url}] is not yet implemented`, response.status);
      }
      const jsonError: QueryError = await this.parseJson(response);
      throw new RequestException(jsonError.message, response.status);
    }
    return response;
  }

  private parseJson = async (response: Response) => {
    const text = await response.text();
    try {
      return JSON.parse(text); // Try to parse it as json
    } catch (err) {
      // This probably means your response is text, do you text handling here
      throw new RequestException('Failed to parse the response [' + text + '] as JSON', response.status);
    }
  }

  getToken = (): string | null => {
    return window.sessionStorage.getItem('user-token');
  }

  getJwtToken = (): JwtToken | undefined => {
    const token = window.sessionStorage.getItem('user-token');
    if (token !== null) {
      return new JwtHelper().decodeToken(token);
    }
    return undefined;
  }
}