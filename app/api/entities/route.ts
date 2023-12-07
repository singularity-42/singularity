import fs from "fs";
import * as glob from "glob";

import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
  let entity_type = req.nextUrl.searchParams.get("entity_type");
  let filter = req.nextUrl.searchParams.get("filter");
  const entityFiles = glob.sync(`./docs/${entity_type}/**/*.md`);
  const entities = entityFiles.map((file) => {
    const content = fs.readFileSync(file, "utf8");
    // use regex to split the path at \\ or / depending on OS
    let pathList = file.split(/\\|\//);
    pathList.shift();
    pathList.shift();
    let path = pathList.join("\\");
    return { file, content, path };
  });

  const extractMetadata = (metadataString: string | undefined, title: string = "") => {
    if (!metadataString || !metadataString.includes("\n")) {
      return { title };
    }

    const metadataArray = metadataString
      .split("\n")
      .map((item: string) => item.trim())
      .filter(Boolean);

    if (metadataArray.length == 0) {
      return { title };
    }

    const metadata: any = {};
    metadataArray.forEach((item) => {
      if (!item.includes(":")) {
        if (item[0] === "-") {
          const item_ = item.replace("-", "").trim();
          const list_key = Object.keys(metadata).pop() || "";
          const _list = metadata[list_key] || [];
          _list.push(item_);
          metadata[list_key] = _list;
        }
      } else {
        const [key, value] = item.split(":").map((s) => s.trim());
        if (key.length > 0) metadata[key] = value;
      }
    });
    let _metadata = {
      title,
      ...metadata,
    };
    return _metadata;
  };

  const responseJSON = JSON.stringify(
    entities
      .map((file: any) => {
        const [file_name] = file.file.split(/\\|\//).slice(-1)[0].split(".md");
        const metadataString = file.content.split("---")[1];
        const metadata = extractMetadata(metadataString, file_name);

        if (filter && filter !== "all") {
          const requestedFilter = filter.split(",");
          const metadataFilter = metadata.tags || [];

          if (!requestedFilter.every((filter) => metadataFilter.includes(filter))) {
            return null;
          }
        }

        let content = file.content.split("---")[2] || "";
        if (content.length === 0) {
          content = file.content;
        }
        return {
          path: file.path,
          metadata: metadata,
          content: content,
        };
      })
      .filter(Boolean)
  );

  return new Response(responseJSON, {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
};
