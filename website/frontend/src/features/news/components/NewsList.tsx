import { NewsItem } from "../schema";
import { NewsCard } from "./NewsCard";
import { NeoGrid } from "@/components/layout/neo-grid";

interface NewsListProps {
    items: NewsItem[];
}

export function NewsList({ items }: NewsListProps) {
    return (
        <NeoGrid>
            {items.map((item) => (
                <NewsCard key={item.id} item={item} />
            ))}
        </NeoGrid>
    );
}
