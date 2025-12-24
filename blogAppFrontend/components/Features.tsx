'use client';

import { featuredPosts } from "@/lib/data";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface FeaturedSectionProps {
  currentUser?: { id: string; username: string } | null;
}

export default function FeaturedSection({ currentUser }: FeaturedSectionProps) {
  const router = useRouter();

  // Manage likes state globally
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [likesCount, setLikesCount] = useState<Record<number, number>>(
    Object.fromEntries(featuredPosts.map(post => [post.id, post.likes]))
  );

  const handleLikeClick = (postId: number) => {
    if (!currentUser) return router.push('/auth/sign-in');

    setLikes(prev => {
      const isLiked = prev[postId];
      setLikesCount(countPrev => ({
        ...countPrev,
        [postId]: isLiked ? countPrev[postId] - 1 : countPrev[postId] + 1
      }));
      return { ...prev, [postId]: !isLiked };
    });
  };

  const handleCommentClick = (postId: number) => {
    if (!currentUser) return router.push('/auth/sign-in');
    router.push(`/posts/${postId}`);
  };

  return (
    <section className="w-full mt-8 px-[8%] py-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Featured Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Curated thoughts and discoveries from the intersection of technology, design, and human experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {featuredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-xs py-0">
                <CardHeader className="p-0 relative">
                  <div className="w-full h-56 relative">
                    <Image
                      fill
                      src={post.image}
                      alt={post.title}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant="secondary"
                      className="bg-background/80 backdrop-blur-xs">
                      {post.categories[0]}
                    </Badge>
                  </div>

                  {/* Author info */}
                  <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-background/70 backdrop-blur-xs p-1 rounded">
                    <Image
                      src={post.authorPhoto}
                      alt={post.authorName}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {post.authorName}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    {post.date}
                  </div>

                  <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleLikeClick(post.id)}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${likes[post.id] ? 'text-red-500' : 'text-gray-400'}`}
                        />
                        <span>{likesCount[post.id]}</span>
                      </div>

                      <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => handleCommentClick(post.id)}
                      >
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span>{post.comments}</span>
                      </div>
                    </div>

                    <div className="flex items-center text-primary font-medium group-hover:underline">
                      Read more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
