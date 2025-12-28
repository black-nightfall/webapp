import { ForumPost } from "../schema";
import { ForumPostCard } from "./ForumPostCard";
import { NeoGrid } from "@/components/layout/neo-grid";
import { motion } from "framer-motion";

interface ForumListProps {
    posts: ForumPost[];
}

export function ForumList({ posts }: ForumListProps) {
    return (
        <NeoGrid>
            {posts.map((post, index) => (
                <ForumPostCard key={post.id} post={post} />
            ))}
        </NeoGrid>
    );
}
