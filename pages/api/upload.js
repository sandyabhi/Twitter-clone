// import multiparty from "multiparty";
import { initMongoose } from "../../lib/mongoose";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import User from "../../models/User";

export default async function handle(req, res) {
  // const form = new multiparty.Form({ uploadDir: "./public" });
  await initMongoose();
  const session = await unstable_getServerSession(req, res, authOptions);
  const { image } = req.body;

  const user = await User.findByIdAndUpdate(session.user.id, { cover: image });

  res.json(image);
}
