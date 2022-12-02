import { initMongoose } from "../../lib/mongoose";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import Post from "../../models/Post";
import Like from "../../models/Like";
// import Follower from "../../models/Follower";

export default async function handler(req, res) {
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const { id } = req.query;
    if (id) {
      const post = await Post.findById(id).populate("author").populate({
        path: "parent",
        populate: "author",
      });
      res.json({ post });
    } else {
      const parent = req.query.parent || null;
      const author = req.query.author;

      let searchFilter;

      // Maybe not a good idea to only see posts of people I follow in Home Page
      // if (!author && !parent) {
      //   const myFollows = await Follower.find({
      //     source: session.user.id,
      //   }).exec();
      //   const idsOfPeopleIFollow = myFollows.map((f) => f.destination);
      //   console.log({ idsOfPeopleIFollow });
      //   searchFilter = { author: [...idsOfPeopleIFollow, session.user.id] };
      // }

      if (author) {
        searchFilter = { author };
      }

      if (parent) {
        searchFilter = { parent };
      }

      const posts = await Post.find(searchFilter)
        .populate("author")
        .populate({
          path: "parent",
          populate: "author",
        })
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

  // if (req.method === "GET") {
  //   const { id } = req.query;
  //   if (id) {
  //     const post = await Post.findById(id).populate("author");
  //     res.json({ post });
  //   } else {
  //     const parent = req.query.parent || null;
  //     const author = req.query.author;

  //     const searchFilter = author ? { author } : { parent };

  //     const posts = await Post.find({ searchFilter })
  //       .populate("author")
  //       .sort({ createdAt: -1 })
  //       .limit(20)
  //       .exec();

  //     const postsLikedByMe = await Like.find({
  //       author: session.user.id,
  //       post: posts.map((p) => p._id),
  //     });

  //     const idsLikedByMe = postsLikedByMe.map((like) => like.post);
  //     res.json({ posts, idsLikedByMe });
  //   }
  // }

  if (req.method === "POST") {
    const { text, parent, images } = req.body;
    const post = await Post.create({
      author: session.user.id,
      text,
      parent,
      images,
    });

    if (parent) {
      const parentPost = await Post.findById(parent);
      parentPost.commentsCount = await Post.countDocuments({ parent });
      await parentPost.save();
    }

    res.json(post);
  }
}
