import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    // 목록 카드와 상세 상단에 쓰는 한 줄 소개
    summary: z.string(),
    period: z.string(),
    role: z.string(),
    team: z.string().optional(),
    stack: z.array(z.string()),
    // 목록 카드에 강조해서 보여줄 핵심 성과 한 줄 (선택)
    highlight: z.string().optional(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    // 트러블슈팅은 문제 → 원인 → 해결 → 결과 표로 렌더링됩니다.
    troubleshooting: z
      .array(
        z.object({
          title: z.string(),
          problem: z.string(),
          cause: z.string(),
          solution: z.string(),
          result: z.string(),
        }),
      )
      .default([]),
    lesson: z.string().optional(),
    order: z.number().default(99),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
