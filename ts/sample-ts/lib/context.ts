import { Node } from "constructs";

export type StageType = "staging" | "production";

interface ContextObjectInterface {
  subDomainName: string;
  account: AccountContext;
  dummy: DummyContext;
}

export interface AccountContext {
  id: string;
  name: string;
}

export interface DummyContext {
  accountId: string;
  uniqueId: string;
}

export class Context {
  private _container: ContextObjectInterface;
  public appEnv: StageType;
  public account: AccountContext;
  public dummy: DummyContext;
  public subDomainName: string;

  constructor(stage: StageType, node: Node) {
    const ctx = node.tryGetContext(stage);
    this.appEnv = stage;
    this._container = ctx;

    this.account = this._container.account;
    this.dummy = this._container.dummy;
    this.subDomainName = this._container.subDomainName;
  }
}
