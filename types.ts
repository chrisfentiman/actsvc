import {
  attribute,
  hashKey,
  table
} from "@aws/dynamodb-data-mapper-annotations";

@table(process.env.DYNAMO_TABLE_NAME)
export class Account {
  // Future state -0 auto generate guid on create
  // @hashKey({ defaultProvider: () => "guid" })
  @hashKey()
  guid: string;
  @attribute()
  given_name: string;
  @attribute()
  family_name: string;
  @attribute()
  birthdate: string;
  @attribute()
  pin: string;
}

export interface Viewer {}
