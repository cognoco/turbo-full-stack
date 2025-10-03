"use client";

import { trpc } from "../trpc/client";

export default function Home() {
  const { data } = trpc.todo.getAllTodos.useQuery();

  console.log("Data", data);

  return <></>;
}
