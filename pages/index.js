import axios from "axios";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PostContent from "../components/PostContent";
import PostForm from "../components/PostForm";
import UsernameForm from "../components/UsernameForm";
import useUserInfo from "../hooks/useUserInfo";

export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();
  const [posts, setPosts] = useState([]);

  async function fetchHomePosts() {
    await axios.get("api/posts").then((res) => {
      setPosts(res.data);
    });
  }

  useEffect(() => {
    fetchHomePosts();
  }, []);

  if (userInfoStatus === "loading") {
    return "loading user info";
  }

  if (!userInfo?.username) {
    return <UsernameForm />;
  }

  console.log(userInfo?.image);
  return (
    <Layout>
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm
        onPost={() => {
          fetchHomePosts();
        }}
      />

      <div className="">
        {posts.length > 0 &&
          posts.map((post) => (
            <div className="border-t border-twitterBorder p-5 ">
              <PostContent {...post} />
            </div>
          ))}
      </div>
    </Layout>
  );
}
