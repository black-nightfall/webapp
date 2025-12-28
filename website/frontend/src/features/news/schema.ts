import { z } from "zod";

export const NewsItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    content: z.string(),
    author: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    imageUrl: z.string().optional(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

export const NewsListSchema = z.array(NewsItemSchema);
