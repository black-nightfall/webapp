import { z } from "zod";

export const ForumPostSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    author: z.object({
        name: z.string(),
        avatar: z.string().optional(),
    }),
    category: z.enum(["Health", "Training", "Cute", "General"]),
    likes: z.number(),
    comments: z.number(),
    date: z.string(),
    isHot: z.boolean().optional(),
});

export type ForumPost = z.infer<typeof ForumPostSchema>;

export const ForumPostListSchema = z.array(ForumPostSchema);
