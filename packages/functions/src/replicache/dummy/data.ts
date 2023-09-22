import { DateTime } from "luxon";
import { AWS } from "@console/core/aws";
import { User } from "@console/core/user";
import { Issue } from "@console/core/issue";
import { App, Stage } from "@console/core/app";
import { Warning } from "@console/core/warning";
import type { Usage } from "@console/core/billing";
import { Workspace } from "@console/core/workspace";
import { Resource } from "@console/core/app/resource";

const APP_ID = "1";
const APP_ID_LONG = "2";
const APP_LOCAL = "dummy";
const STAGE_LOCAL = "dummy";
const ACCOUNT_ID = "connected";
const ACCOUNT_ID_LONG = "long";
const ACCOUNT_ID_FAILED = "failed";
const ACCOUNT_ID_SYNCING = "syncing";

export type DummyConfig =
  | "empty"
  | "overview:base"
  | "overview:all;usage:overage;subscription:active";

type DummyData =
  | (Workspace.Info & { _type: "workspace" })
  | (Omit<Usage, "workspaceID"> & { _type: "usage" })
  | (Omit<App.Info, "workspaceID"> & { _type: "app" })
  | (Omit<User.Info, "workspaceID"> & { _type: "user" })
  | (Omit<Stage.Info, "workspaceID"> & { _type: "stage" })
  | (Omit<Issue.Info, "workspaceID"> & { _type: "issue" })
  | (Omit<Warning.Info, "workspaceID"> & { _type: "warning" })
  | (Omit<Resource.Info, "workspaceID"> & { _type: "resource" })
  | (Omit<AWS.Account.Info, "workspaceID"> & { _type: "awsAccount" });

function stringToObject(input: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  const pairs = input.split(";");
  for (let pair of pairs) {
    const [key, value] = pair.split(":");
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  }

  return result;
}

interface WorkspaceProps {
  id: string;
  activeSubscription?: boolean;
}
function workspace({ id, activeSubscription }: WorkspaceProps): DummyData {
  return {
    _type: "workspace",
    id,
    slug: id,
    timeCreated: DateTime.now().toSQL()!,
    timeDeleted: null,
    timeUpdated: DateTime.now().toSQL()!,
    stripeSubscriptionItemID: null,
    stripeCustomerID: null,
    stripeSubscriptionID: activeSubscription ? "sub_123" : null,
  };
}

interface UserProps {
  id?: string;
  email: string;
  active?: boolean;
  deleted?: boolean;
}
function user({ id, email, active, deleted }: UserProps): DummyData {
  return {
    _type: "user",
    email,
    id: id || email,
    timeCreated: DateTime.now().toSQL()!,
    timeUpdated: DateTime.now().toSQL()!,
    timeSeen: active ? DateTime.now().toSQL()! : null,
    timeDeleted: deleted ? DateTime.now().toSQL()! : null,
  };
}

interface AccountProps {
  id: string;
  failed?: boolean;
  accountID: string;
  syncing?: boolean;
}
function account({ id, accountID, failed, syncing }: AccountProps): DummyData {
  return {
    _type: "awsAccount",
    id,
    accountID: accountID,
    timeDeleted: null,
    timeUpdated: DateTime.now().toSQL()!,
    timeCreated: DateTime.now().toSQL()!,
    timeFailed: failed ? DateTime.now().toSQL()! : null,
    timeDiscovered: syncing ? null : DateTime.now().toSQL()!,
  };
}

interface StageProps {
  id: string;
  appID: string;
  region?: string;
  awsAccountID: string;
}
function stage({ id, appID, region, awsAccountID }: StageProps): DummyData {
  return {
    _type: "stage",
    id,
    appID,
    name: id,
    awsAccountID,
    timeDeleted: null,
    region: region || "us-east-1",
    timeCreated: DateTime.now().toSQL()!,
    timeUpdated: DateTime.now().toSQL()!,
  };
}

interface AppProps {
  id: string;
  name?: string;
}
function app({ id, name }: AppProps): DummyData {
  return {
    _type: "app",
    id,
    name: name || id,
    timeDeleted: null,
    timeCreated: DateTime.now().toSQL()!,
    timeUpdated: DateTime.now().toSQL()!,
  };
}

export function* generateData(
  config: DummyConfig
): Generator<DummyData, void, unknown> {
  const configMap = stringToObject(config);

  yield workspace({
    id: "dummy-workspace",
    activeSubscription: configMap["subscription"] === "active",
  });

  yield user({ id: "dummy", email: "me@example.com", active: true });
  yield user({ email: "invited-dummy@example.com" });
  yield user({
    email: "deleted-dummy@example.com",
    active: true,
    deleted: true,
  });

  if (configMap["overview"] === "full") {
    for (let i = 0; i < 30; i++) {
      yield user({ email: `dummy${i}@example.com`, active: true });
    }
  }

  if (configMap["overview"]) yield* overviewBase();

  if (configMap["overview"] === "full") yield* overviewFull();

  if (configMap["usage"] === "overage") yield* usageOverage();
}

function* overviewBase(): Generator<DummyData, void, unknown> {
  yield account({ id: ACCOUNT_ID_LONG, accountID: "123456789012" });
  yield app({ id: APP_LOCAL });
  yield app({
    id: APP_ID_LONG,
    name: "my-sst-app-that-has-a-really-long-name-that-should-be-truncated",
  });
  yield stage({
    id: STAGE_LOCAL,
    appID: APP_LOCAL,
    awsAccountID: ACCOUNT_ID_LONG,
  });
  yield stage({
    id: "stage-long-id-1",
    appID: APP_ID_LONG,
    awsAccountID: ACCOUNT_ID_LONG,
  });
  yield stage({
    id: "this-stage-name-is-really-long-and-needs-to-be-truncated",
    appID: APP_ID_LONG,
    region: "ap-southeast-1",
    awsAccountID: ACCOUNT_ID_LONG,
  });
}

function* overviewFull(): Generator<DummyData, void, unknown> {
  yield app({ id: APP_ID, name: "my-sst-app" });
  yield account({
    id: "syncing-empty",
    accountID: "123456789013",
    syncing: true,
  });
  yield account({
    id: "failed-empty",
    accountID: "123456789014",
    failed: true,
  });
  yield account({ id: "empty", accountID: "123456789015" });
  yield account({
    id: ACCOUNT_ID_FAILED,
    accountID: "123456789016",
    failed: true,
  });
  yield stage({
    id: "stage-account-failed",
    appID: APP_ID,
    region: "ap-southeast-1",
    awsAccountID: ACCOUNT_ID_FAILED,
  });
  yield account({
    id: ACCOUNT_ID_SYNCING,
    accountID: "123456789017",
    syncing: false,
  });
  yield stage({
    id: "stage-account-syncing",
    appID: APP_ID,
    awsAccountID: ACCOUNT_ID_SYNCING,
  });
  yield account({ id: ACCOUNT_ID, accountID: "123456789018" });

  for (let i = 0; i < 30; i++) {
    yield stage({ id: `stage-${i}`, appID: APP_ID, awsAccountID: ACCOUNT_ID });
  }
}

function* usageOverage(): Generator<DummyData, void, unknown> {
  yield {
    _type: "usage",
    id: "1",
    day: "2021-01-01",
    stageID: "stage-account-overage",
    invocations: 100,
    timeCreated: DateTime.now().toSQL()!,
    timeDeleted: null,
    timeUpdated: DateTime.now().toSQL()!,
  };
  yield {
    _type: "usage",
    id: "2",
    day: "2021-01-02",
    stageID: "stage-account-overage",
    invocations: 1230000,
    timeCreated: DateTime.now().toSQL()!,
    timeDeleted: null,
    timeUpdated: DateTime.now().toSQL()!,
  };
}
