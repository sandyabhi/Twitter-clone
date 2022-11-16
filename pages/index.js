import PostForm from "../components/PostForm";
import UsernameForm from "../components/UsernameForm";
import useUserInfo from "../hooks/useUserInfo";

export default function Home() {
  const { userInfo, status: userInfoStatus } = useUserInfo();

  if (userInfoStatus === "loading") {
    return "loading user info";
  }

  if (!userInfo?.username) {
    return <UsernameForm />;
  }

  console.log(userInfo?.image);
  return (
    <div className="max-w-xl mx-auto border-l border-r border-twitterBorder min-h-screen">
      <h1 className="text-lg font-bold p-4">Home</h1>
      <PostForm />
    </div>
  );
}
