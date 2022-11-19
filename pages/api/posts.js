import { initMongoose } from "../../lib/mongoose";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Post from "../../models/Post";
import Like from "../../models/Like";

export default async function handler(req, res) {
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author");
      res.json({ post });
    } else {
      const posts = await Post.find()
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(20)
        .exec();

      const postsLikedByMe = await Like.find({
        author: session.user.id,
        post: posts.map((p) => p._id),
      });
      const idsLikedByMe = postsLikedByMe.map((like) => like.post);
      res.json({ posts, idsLikedByMe });
    }
  }

  if (req.method === "POST") {
    const { text } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
    });
    res.json(post);
  }
}
