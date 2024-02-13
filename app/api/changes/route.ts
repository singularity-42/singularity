import { Change, FileContent, Metadata } from "@/types";
import { getChanges, loadFile } from "@/utilities/file";
import fs from "fs";
import * as glob from "glob";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    let newFile = await req.json() as FileContent;
    let crrFile = loadFile(newFile.name);
    if (!crrFile)
        return new Response(JSON.stringify({ error: "file not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });

    // currently metadata is with flat in file, define metadata with filtered keys ""markdown" or "title"
    let changes: Change[] = getChanges(crrFile, newFile);

    console.log(changes, "changes");

    return new Response(JSON.stringify(newFile), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};