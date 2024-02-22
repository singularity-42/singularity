import { loadFiles } from "@/utilities/file";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  let category = req.nextUrl.searchParams.get("category") || "";
  let tagsParam = req.nextUrl.searchParams.get("tags") || "";
  let nameParam = req.nextUrl.searchParams.get("name") || "";
  let connectionsParam = req.nextUrl.searchParams.get("connections") || "";

  // if no params retrurn error
  if (category === "" && tagsParam === "" && nameParam === "" && connectionsParam === "")
    return new Response(JSON.stringify({ error: "No params provided" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });

  let connections = connectionsParam.split(",") || [];
  connections = connections.filter((connection) => connection !== "");
  
  let tags = tagsParam.split(",") || [];
  tags = tags.filter((tag) => tag !== "");

  let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];
  
  let files = loadFiles(category, tags, credentials, connections, nameParam) || [];

  if (category.includes("collaborations"))
    files = files.filter((file: any) => {
      let date = new Date(file?.date.split("-").reverse());
      let now = new Date();
      return date.getTime() >= now.getTime() - 1000 * 60 * 60 * 24;
    });

  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
