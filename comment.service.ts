import { Account } from "./types";
import { IAccountStorage, AccountStorage } from "./comment.storage";
import { Viewer } from "./viewer";

export interface IAccountService {
  getAccount(guid: string, viewer: Viewer): Promise<Account>;
}

enum Actions {
  GET,
  EDIT,
  DELETE
}

function canDo(guid: string, viewer: Viewer, action: Actions): Boolean {
  if (viewer.isUser && viewer.userId != guid) {
    return false;
  }

  switch (action) {
    case Actions.GET:
      for (let scope of viewer.permissions) {
        switch (scope) {
          case "user:read":
          case "user:read:rider":
            return true;
        }
      }
      return false;
    case Actions.EDIT:
    case Actions.DELETE:
      for (let scope of viewer.permissions) {
        switch (scope) {
          case "user:write":
          case "user:write:rider":
            return true;
        }
      }
      return false;
  }
}

function scopeViewer(data: Account, viewer: Viewer): Account {
  let acct = data;
  if (
    viewer.hasPermission("user:read") &&
    !viewer.hasPermission("user:read:rider")
  ) {
    acct.pin = null;
  }

  return acct;
}

export class AccountService implements IAccountService {
  accountStore: IAccountStorage;

  constructor(store?: IAccountStorage) {
    if (store) {
      this.accountStore = store;
    } else {
      this.accountStore = new AccountStorage();
    }
  }

  async getAccount(guid: string, viewer: Viewer): Promise<Account> {
    if (!canDo(guid, viewer, Actions.GET)) {
      // null for now, 401 type error later
      return null;
    }

    this.accountStore
      .get(guid)
      .then((value: Account) => {
        if (value == null) {
          return null;
        }

        return scopeViewer(value, viewer);
      })
      .catch(err => {
        // do work
        throw err;
      });
  }
}
