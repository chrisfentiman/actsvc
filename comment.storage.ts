import { Account } from "./types";
import { DataMapper } from "@aws/dynamodb-data-mapper";
import * as DynamoDB from "aws-sdk/clients/dynamodb";

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000"
  };
}

const mapper = new DataMapper({
  client: new DynamoDB(options), // the SDK client used to execute operations
  tableNamePrefix: "dev_" // optionally, you can provide a table prefix to keep your dev and prod tables separate
});
export interface IAccountStorage {
  get(key: string): Promise<Account>;
}

export class AccountStorage {
  async get(key: string): Promise<Account> {
    return mapper.get(Object.assign(new Account(), { guid: key }));
  }
}
