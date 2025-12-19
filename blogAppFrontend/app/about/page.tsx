export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">About This Blog</h1>

      <p className="text-lg text-muted-foreground mb-4">
        Welcome to my blog application. This platform is built to share
        articles, tutorials, and ideas about software development and
        technology.
      </p>

      <p className="text-lg text-muted-foreground mb-4">
        The blog is built using modern web technologies like Next.js,
        React, and Tailwind CSS, with a backend powered by Spring Boot
        and REST APIs.
      </p>

      <p className="text-lg text-muted-foreground mb-4">
        My goal is to create a clean, fast, and easy-to-use blogging
        platform for learning and sharing knowledge.
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside text-muted-foreground">
          <li>User authentication</li>
          <li>Create and read blog posts</li>
          <li>Search and pagination</li>
          <li>Responsive design</li>
        </ul>
      </div>
    </main>
  );
}
