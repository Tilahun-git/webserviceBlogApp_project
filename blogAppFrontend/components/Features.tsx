
import { featuredPosts } from "@/lib/data";
import * as motion from "motion/react-client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowRight, Calendar } from "lucide-react";
import Image from "next/image";

export default function FeaturedSection() {
  const posts = featuredPosts;
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
            Curated thoughts and discoveries from the intersection of
            technology, design, and human experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-2">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-xs py-0">
                <CardHeader className="p-7">
                  <div className="relative">
                    <div className="w-full h-48 relative">
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
                        className="bg-background/80 backdrop-blur-xs"
                      >
                        {post.categories[0]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-9 pt-4">
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
                  <div className="flex items-center text-primary font-medium group-hover:underline">
                    Read more{" "}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
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
