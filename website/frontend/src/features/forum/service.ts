import { ForumPostListSchema, ForumPost } from "./schema";

const MOCK_ORUM_POSTS: ForumPost[] = [
    {
        id: "1",
        title: "My cat keeps staring at the wall... is it ghosts? 👻",
        content: "He literally sits there for hours just staring at blank space. Should I call a priest or a vet?",
        author: {
            name: "SpookyCatMom",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Spooky"
        },
        category: "General",
        likes: 156,
        comments: 42,
        date: "2024-03-25",
        isHot: true
    },
    {
        id: "2",
        title: "Review: The best automatic litter box 2024",
        content: "I've tried them all, and the SpaceToilet 3000 is the only one my chonky boy fits in.",
        author: {
            name: "TechVet",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tech"
        },
        category: "Health",
        likes: 89,
        comments: 12,
        date: "2024-03-24"
    },
    {
        id: "3",
        title: "Look at his little bow tie! 🎀",
        content: "Just wanted to share Mr. Whiskers ready for his date tonight.",
        author: {
            name: "ProudDad",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dad"
        },
        category: "Cute",
        likes: 1024,
        comments: 89,
        date: "2024-03-23",
        isHot: true
    },
    {
        id: "4",
        title: "How do I stop my dog from eating socks?",
        content: "We are on pair #43 this month. He has a preference for wool.",
        author: {
            name: "SockLess",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sock"
        },
        category: "Training",
        likes: 45,
        comments: 67,
        date: "2024-03-22"
    }
];

export const ForumService = {
    getLatestPosts: async (): Promise<ForumPost[]> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Validate mock data with Zod
        const result = ForumPostListSchema.safeParse(MOCK_ORUM_POSTS);

        if (!result.success) {
            console.error("Data validation failed", result.error);
            return [];
        }

        return result.data;
    }
};
