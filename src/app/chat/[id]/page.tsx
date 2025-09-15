"use client";
import ChatApp from "@/components/Chat";
import { useParams } from "next/navigation";

export default function () {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <p>ID is Undefined</p>;
  }
  return <ChatApp chatId={id} />;
}
