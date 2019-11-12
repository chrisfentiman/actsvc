import * as jwt from "jsonwebtoken";

interface Token {
  userId: string;
  tenantId: string;
  scopes: Array<string>;
}
export class Viewer {
  private decoded: Token;

  constructor(authToken: string) {
    const token = jwt.decode(authToken, { complete: true });
    this.decoded = token.
  }

  get isUser(): Boolean {
    return this.decoded.userId ? true : false;
  }

  get userId(): string {
    return this.decoded.userId;
  }

  get permissions(): Array<string> {
    return this.decoded.scopes;
  }

  hasPermission(scope: string): Boolean {
    return this.decoded.scopes.includes(scope);
  }
}
