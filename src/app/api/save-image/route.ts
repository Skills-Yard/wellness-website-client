import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    const base64Data = image.replace(/^data:image\/png;base64,/, "");
    const filePath = path.join(process.cwd(), "public/images/vellora_promise_stamp.png");
    
    // Write the decoded base64 string to the target file path
    fs.writeFileSync(filePath, base64Data, "base64");
    return NextResponse.json({ success: true, path: filePath });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
