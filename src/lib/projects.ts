import { getCollection, type CollectionEntry } from "astro:content";
import { numberProjects } from "./project-rules.mjs";

export { numberProjects, letterParagraphs } from "./project-rules.mjs";

export type PublishedProject = CollectionEntry<"projects"> & { fileNo: string; reviewed: boolean };

export async function getPublishedProjects(): Promise<PublishedProject[]> {
  return numberProjects(await getCollection("projects")) as PublishedProject[];
}
