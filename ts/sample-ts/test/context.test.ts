import * as cdk from "aws-cdk-lib";
import { Context } from "../lib/context";

test("Context instance", () => {
  const app = new cdk.App({
    context: {
      staging: {
        account: {
          name: "test",
          id: "000000000",
        },
        dummy: {
          accountId: "000000000",
          uniqueId: "000000000-000000000-000000000-000000000-000000000",
        },
        subDomainName: "subdomain-test",
      },
    },
  });
  const ctx = new Context("staging", app.node);
  expect(ctx.appEnv).toEqual("staging");
  expect(ctx.account.id).toEqual("000000000");
  expect(ctx.account.name).toEqual("test");
  expect(ctx.dummy.accountId).toEqual("000000000");
  expect(ctx.dummy.uniqueId).toEqual(
    "000000000-000000000-000000000-000000000-000000000"
  );
  expect(ctx.subDomainName).toEqual("subdomain-test");
});
