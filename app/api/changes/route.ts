import { Change, FileContent } from "@/app/types";
import { generateChangesFile, getChanges, loadFile, saveFile } from "@/data/tools/file";
import { editMetadataKeyValue } from "@/data/tools/metadata";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  let newFile = (await req.json()) as FileContent;

  let credentials = (req.headers.get("Authorization")?.split(' ')[1] || '').split(':') || [];
  let crrFile = loadFile(credentials, newFile.name);
  
  if (!crrFile)
    return new Response(JSON.stringify({ error: "file not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });

    let changes: Change[] = getChanges(crrFile, newFile);
  if (changes.length === 0) {
    return new Response(JSON.stringify({ error: "no changes" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  
  let changesFile = generateChangesFile(newFile, crrFile.name);
  // generate new credentials
  // TODO: do this in secure way

  // we need 9 random chars 0-9 A-Z splited by - in groups of 3
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let newCredentials = "";
  for (let i = 1; i < 10; i++) {
    if (i % 3 === 1 && i !== 1)
      newCredentials += "-";
    newCredentials += chars[Math.floor(Math.random() * chars.length)];
  }

  changesFile.metadata = editMetadataKeyValue(changesFile.metadata, "credentials", newCredentials);
  saveFile(changesFile);

  return new Response(JSON.stringify({
    file: crrFile,
    credentials: newCredentials
  }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
