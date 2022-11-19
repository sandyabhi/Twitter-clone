import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import PostContent from "../../../components/PostContent";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState();

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/posts?id=" + id).then((response) => {
      setPost(response.data.post);
    });
  }, [id]);

  return (
    <Layout>
      {post?._id && (
        <div className="p-5 py-2">
          <div className="flex mb-5 cursor-pointer">
            <Link href={"/"}> {"< "} Tweet </Link>
          </div>
          <PostContent {...post} big />
        </div>
      )}
    </Layout>
  );
}
