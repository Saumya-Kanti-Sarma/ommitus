import { supabase } from "../libs/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Unique file name
    const fileName = `menu/${Date.now()}-${file.name}`;
    const bucket = "ommitus";

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl, message: "File was uploaded successfully" });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "No URL Was found" }, { status: 400 });
    }

    const bucket = "ommitus";

    const fileName = url.replace("https://azjgnoxfyygbnquzecyw.supabase.co/storage/v1/object/public/ommitus/", "");
    console.log(`deleting old file: ${fileName}`);

    //delete the old image
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([`${fileName}`]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "file was deleted", data });

  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}