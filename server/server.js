import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateLegalDocument } from "./services/aiService.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));

const types = ["rental","employment","nda","affidavit","authorization","notice"];

app.get("/api/health", (_, res) => res.json({ success:true, message:"LegalEase API is running" }));

app.get("/api/templates", (_, res) => {
  res.json({
    success:true,
    data: [
      { type:"rental", name:"Rental Agreement", description:"Draft an agreement between a landlord and tenant." },
      { type:"employment", name:"Employment Agreement", description:"Create a structured employment draft." },
      { type:"nda", name:"Non-Disclosure Agreement", description:"Draft a confidentiality agreement." },
      { type:"affidavit", name:"Affidavit", description:"Create a structured declaration draft." },
      { type:"authorization", name:"Authorization Letter", description:"Authorize another person for a stated purpose." },
      { type:"notice", name:"General Legal Notice", description:"Create a formal legal notice draft." }
    ]
  });
});

app.get("/api/documents", async (_, res) => {
  const documents = await prisma.document.findMany({ orderBy:{ createdAt:"desc" }});
  res.json({ success:true, data:documents });
});

app.get("/api/documents/:id", async (req,res) => {
  const doc = await prisma.document.findUnique({ where:{ id:req.params.id }});
  if (!doc) return res.status(404).json({ success:false, message:"Document not found" });
  res.json({ success:true, data:doc });
});

app.post("/api/documents/generate", async (req,res) => {
  const schema = z.object({
    type: z.enum(types),
    title: z.string().min(1),
    data: z.record(z.string(), z.string().optional())
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success:false, message:"Invalid document data" });

  const { type, title, data } = parsed.data;
  const content = await generateLegalDocument(type, data);
  const doc = await prisma.document.create({
    data:{ title, type, inputData:JSON.stringify(data), content, status:"COMPLETED" }
  });
  res.status(201).json({ success:true, data:doc });
});

app.put("/api/documents/:id", async (req,res) => {
  const schema = z.object({ title:z.string().min(1), content:z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success:false, message:"Invalid document content" });

  const doc = await prisma.document.update({
    where:{ id:req.params.id },
    data:parsed.data
  });
  res.json({ success:true, data:doc });
});

app.delete("/api/documents/:id", async (req,res) => {
  await prisma.document.delete({ where:{ id:req.params.id }});
  res.json({ success:true, message:"Document deleted" });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success:false, message:"Something went wrong on the server." });
});

app.listen(PORT, () => console.log(`LegalEase API running on http://localhost:${PORT}`));