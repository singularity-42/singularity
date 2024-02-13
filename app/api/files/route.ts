import { loadFiles } from "@/utilities/file";
import fs from "fs";
import * as glob from "glob";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  let category = req.nextUrl.searchParams.get("category") || "";
  let filter = req.nextUrl.searchParams.get("filter") || "";
  let filters = filter.split(",") || [];
  let files = loadFiles(category, filters) || [];
  
  files = files.filter((file: any) => {
      let date = new Date(file?.date.split("-").reverse());
      let now = new Date();
      
      return date.getTime() >= now.getTime();
  });

  return new Response(JSON.stringify(files), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  })

}
