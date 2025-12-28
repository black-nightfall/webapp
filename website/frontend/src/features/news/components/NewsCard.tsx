import { NewsItem } from "../schema";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface NewsCardProps {
    item: NewsItem;
}

export function NewsCard({ item }: NewsCardProps) {
    return (
        <Card className="h-full flex flex-col hover:bg-yellow-100 transition-colors">
            <CardHeader>
                {item.imageUrl && (
                    <div className="w-full aspect-video rounded-xl border-4 border-black mb-4 overflow-hidden shadow-hard">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                )}
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase border-2 border-black px-2 py-1 rounded-md bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {item.tags[0]}
                    </span>
                    <span className="text-sm font-mono text-muted-foreground">{item.date}</span>
                </div>
                <CardTitle className="text-2xl">{item.title}</CardTitle>
                <CardDescription>By {item.author}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p>{item.summary}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/news/${item.id}`}>Read More</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
