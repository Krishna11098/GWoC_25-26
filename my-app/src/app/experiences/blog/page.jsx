import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogPage from "@/components/BlogPage";

export default function ExperiencesBlogPage() {
  const blogPosts = [
    {
      title: "Murder Mystery Game Night at Primarc Pecan HO, Mumbai",
      category: "Event Highlight",
      description:
        "Inside a high-energy, large-scale corporate game night: 100 employees, 3 murders, endless clues—and zero boredom.",
      image: "/gallery/Blog/Murder%20Mystery.webp",
      href: "/experiences/blog/murder-mystery-primarc-pecan-ho-mumbai",
    },
    {
      title: "Mastering the Mehfil: A Guide to Social Play",
      category: "Game Strategy",
      description:
        "Learn how to facilitate the perfect circle of conversation with our cultural card game.",
      image: "/images/blog-mehfil.jpg",
      href: "/experiences/blog/mastering-mehfil",
    },
    {
      title: "Saturday Night Showdown Recap",
      category: "Event Highlight",
      description:
        "See the best moments from our last live event at the downtown game zone.",
      image: "/images/blog-event.jpg",
      href: "/experiences/blog/saturday-showdown",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="mt-20">
        <BlogPage blogPosts={blogPosts} />
      </div>
      <Footer />
    </>
  );
}
