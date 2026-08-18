export type Blog = {
  id: number;
  title: string;
  author: string;
  url: string;
  likes: number;
};

let blogs: Blog[] = [
  {
    id: 1,
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: 2,
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    id: 3,
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
];

export const getBlogs = () => blogs;

export const getBlog = (id: number) => {
  return blogs.find((b) => b.id === id);
};

export const addBlog = (blog: Omit<Blog, "id" | "likes">) => {
  const newBlog: Blog = {
    id: blogs.length + 1,
    likes: 0,
    ...blog,
  };
  blogs = blogs.concat(newBlog);
  return newBlog;
};

export const likeBlog = (id: number) => {
  const blog = blogs.find((b) => b.id === id);
  if (blog) {
    blog.likes += 1;
  }
  return blog;
};
