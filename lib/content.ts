import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PageData } from "./types";

const contentDir = path.join(process.cwd(), "content", "pages");

export function getPageBySlug(slug: string): PageData {
  const filePath = path.join(contentDir, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data } = matter(fileContents);
  return data as PageData;
}

export function getAllSlugs(): string[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}
