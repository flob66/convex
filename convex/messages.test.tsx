import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";


test("authentification", async () => {
  const t = convexTest(schema);
  const asFlo = t.withIdentity({ name: "Florian Bar" });
  const attributes = await asFlo.run((ctx) => {
    return ctx.auth.getUserIdentity();
  });
  expect(attributes).toMatchObject({ name: "Florian Bar" });
  expect(attributes!.tokenIdentifier).toBeTypeOf("string");
  expect(attributes!.subject).toBeTypeOf("string");
  expect(attributes!.issuer).toBeTypeOf("string");
});

test("create tasks", async () => {
  const t = convexTest(schema);
  await t.mutation(api.tasks.createTask, { text: "Buy groceries", isCompleted: true }); //create task
  await t.mutation(api.tasks.createTask, { text: "Go for a swim", isCompleted: true }); //create task
  await t.mutation(api.tasks.createTask, { text: "Integrate Convex", isCompleted: false }); //create task
});

test("get tasks", async () => {
  const t = convexTest(schema);
  await t.query(api.tasks.get, {}); //get all tasks

  await t.mutation(api.tasks.createTask, { text: "Buy groceries", isCompleted: true }); //create task
  await t.mutation(api.tasks.createTask, { text: "Go for a swim", isCompleted: true }); //create task
  await t.mutation(api.tasks.createTask, { text: "Integrate Convex", isCompleted: false }); //create task

  const messages = await t.query(api.tasks.get); //get pour check si les tables ont bien les données
  expect(messages).toMatchObject([
    { text: "Buy groceries", isCompleted: true },
    { text: "Go for a swim", isCompleted: true },
    { text: "Integrate Convex", isCompleted: false }
  ]);
});

test("update tasks", async () => {
  const t = convexTest(schema);

  const id = await t.mutation(api.tasks.createTask, { text: "Buy groceries", isCompleted: false }); //create task

  const oldMessages = await t.query(api.tasks.get);
  expect(oldMessages).toMatchObject([
    { text: "Buy groceries", isCompleted: false }
  ]);

  await t.mutation(api.tasks.updateTask, {id ,text: "Buy new groceries", isCompleted: true }); //update task

  const messages = await t.query(api.tasks.get);
  expect(messages).toMatchObject([
    { text: "Buy new groceries", isCompleted: true }
  ]);
});

test("delete tasks", async () => {
  const t = convexTest(schema);

  const id = await t.mutation(api.tasks.createTask, { text: "Buy groceries", isCompleted: false }); //create task

  const oldMessages = await t.query(api.tasks.get);
  expect(oldMessages).toMatchObject([
    { text: "Buy groceries", isCompleted: false }
  ]);

  await t.mutation(api.tasks.deleteTask, {id}); //delete task

  const messages = await t.query(api.tasks.get);
  expect(messages).toMatchObject([]);
});