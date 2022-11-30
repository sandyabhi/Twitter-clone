import { initMongoose } from "../../lib/mongoose";
import User from "../../models/User";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handle(req, res) {
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "PUT") {
    const { username } = req.body;
    await User.findByIdAndUpdate(session.user.id, { username });
    res.json("username updated");
  }

  if (req.method === "GET") {
    const { id, username } = req.query;
    const user = id
      ? await User.findById(id)
      : await User.findOne({ username });
    res.json({ user });
  }
}
