import { Change, FileContent, Metadata } from "@/types";
import { generateChangesFile, getChanges, loadFile, saveFile } from "@/utilities/file";
import fs from "fs";
import * as glob from "glob";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  let newFile = (await req.json()) as FileContent;
  let crrFile = loadFile(newFile.name);
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
  saveFile(changesFile);

  return new Response(JSON.stringify(crrFile), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
