import { NewsItem, NewsListSchema } from "./schema";

const MOCK_NEWS: NewsItem[] = [
    {
        id: "1",
        title: "10 Reasons Why Cats are Liquid",
        summary: "Exploring the fluid dynamics of our feline friends.",
        content: "Cats have an uncanny ability to fit into any box, no matter how small. Scientists have finally decided to study this phenomenon...",
        author: "Dr. Meow",
        date: "2024-03-15",
        tags: ["Science", "Cats"],
        imageUrl: "https://images.unsplash.com/photo-1529778873920-4da4926a7071?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "Dog Parks: The Ultimate Social Club",
        summary: "Where good boys meet best friends.",
        content: "The local dog park is more than just a place to run; it's a complex social ecosystem where sniffing is the equivalent of a handshake...",
        author: "Bark Twain",
        date: "2024-03-18",
        tags: ["Lifestyle", "Dogs"],
        imageUrl: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2669&auto=format&fit=crop"
    },
    {
        id: "3",
        title: "Bunny Binkies: What Do They Mean?",
        summary: "Decoding the happy jumps of rabbits.",
        content: "If you've ever seen a rabbit jump into the air and twist, you've witnessed a binky. It's pure joy in physical form...",
        author: "Hop Scotch",
        date: "2024-03-20",
        tags: ["Behavior", "Rabbits"],
        imageUrl: "https://images.unsplash.com/photo-1585110396067-c31ef7fe9306?q=80&w=2400&auto=format&fit=crop"
    },
    {
        id: "4",
        title: "Hamster Mansions",
        summary: "DIY luxury homes for small rodents.",
        content: "Forget the metal cage; modern hamsters demand multi-story villas with eco-friendly bedding...",
        author: "Chip Monk",
        date: "2024-03-22",
        tags: ["DIY", "Hamsters"],
        imageUrl: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=2676&auto=format&fit=crop"
    }
];

export const NewsService = {
    getLatestNews: async (): Promise<NewsItem[]> => {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Validate mock data with Zod
        const result = NewsListSchema.safeParse(MOCK_NEWS);

        if (!result.success) {
            console.error("Data validation failed", result.error);
            return [];
        }

        return result.data;
    },

    getNewsById: async (id: string): Promise<NewsItem | null> => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const item = MOCK_NEWS.find(n => n.id === id);
        if (!item) return null;

        return item;
    }
};
