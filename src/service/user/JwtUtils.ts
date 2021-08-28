export class JwtToken {
  rawToken: string;
  properties: any;

  constructor(rawToken: string, properties: any) {
    this.rawToken = rawToken;
    this.properties = properties;
  }

  isExpired = (): boolean => {
    return false;
  }
}

export class InvalidJwt extends Error {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidJwt.prototype);
  }
}

export class JwtHelper {

  private urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // tslint:disable-next-line:no-string-throw
        throw new InvalidJwt('The token is invalid');
    }
    return decodeURIComponent((window as any).escape(window.atob(output)));
  }

  public decodeToken(token: string): JwtToken {
    if (token === null || token === '') {
      throw new InvalidJwt('The token is invalid');
    }
    const parts = token.split('.');
    if (parts.length !== 3) {

      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new InvalidJwt('Cannot decode the token');
    }
    return new JwtToken(token, JSON.parse(decoded));
  }
}