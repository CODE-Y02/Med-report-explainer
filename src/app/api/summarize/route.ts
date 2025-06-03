import { summarizeText } from "@/lib/summarizationService";
import { unlinkSync } from "fs";
import { mkdir } from "fs/promises";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pdf from "pdf-parse/lib/pdf-parse.js";

const unlinkFIle = (filePath: string) => {
  try {
    unlinkSync(filePath);
  } catch (error) {
    console.log("Error deleting file", error);
  }
};

const uploadDir = join(process.cwd(), "tmp/uploads");

export async function POST(req: Request) {
  const uniqueName = `${uuidv4()}.pdf`;
  const filePath = join(uploadDir, uniqueName);

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    await mkdir(uploadDir, { recursive: true });

    // Process file and generate summary...
    // const summary = await processAndSummarizePdf(file, filePath);

    console.log("file", file);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("buffer", buffer);

    const data = await pdf(buffer);
    const summary = await summarizeText(data.text);

    // Delete the file after processing
    unlinkFIle(filePath);

    return Response.json({
      success: true,
      summary: summary,
      fileName: uniqueName,
    });
  } catch (error) {
    unlinkFIle(filePath);
    return Response.json(
      { error: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
