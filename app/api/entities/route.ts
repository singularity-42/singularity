import { loadFiles } from "@/data/tools/file";
import { FileContent } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  let category = req.nextUrl.searchParams.get("category") || "";
  let tagsParam = req.nextUrl.searchParams.get("tags") || "";
  let nameParam = req.nextUrl.searchParams.get("name") || "";
  let connectionsParam = req.nextUrl.searchParams.get("connections") || "";

  if (category === "" && tagsParam === "" && nameParam === "" && connectionsParam === "")
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });

  let connections = connectionsParam.split(",") || [];
  connections = connections.filter((connection) => connection !== "");

  let tags = tagsParam.split(",") || [];
  tags = tags.filter((tag) => tag !== "");

  let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];

  let files: FileContent[] = [];

  try {
    files = loadFiles(category, tags, credentials, connections, nameParam) || [];
    } catch (error) {
    }

  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
