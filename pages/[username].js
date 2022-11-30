import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Avatar from "../components/Avatar";
import Cover from "../components/Cover";
import Layout from "../components/Layout";
import PostContent from "../components/PostContent";
import TopNavLink from "../components/TopNavLink";
import useUserInfo from "../hooks/useUserInfo";

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;
  const { userInfo } = useUserInfo();

  const [profileInfo, setProfileInfo] = useState();
  const [originalUserInfo, setOriginalUserInfo] = useState();
  const [posts, setPosts] = useState([]);
  const [postsLikedByMe, setPostsLikedByMe] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!username) {
      return;
    }
    axios.get("/api/users?username=" + username).then((response) => {
      setProfileInfo(response.data.user);
      setOriginalUserInfo(response.data.user);
    });
  }, [username]);

  useEffect(() => {
    if (!profileInfo?._id) {
      return;
    }
    axios.get("/api/posts?author=" + profileInfo._id).then((response) => {
      setPosts(response.data.posts);
      setPostsLikedByMe(response.data.idsLikedByMe);
    });
  }, [profileInfo]);

  const isMyProfile = profileInfo?._id === userInfo?._id;

  async function updateProfile() {
    const { bio, name, username } = profileInfo;
    await axios.put("/api/profile", {
      bio,
      name,
      username,
    });
    setEditMode(false);
  }

  function cancel() {
    setProfileInfo((prev) => {
      const { bio, name, username } = originalUserInfo;
      return { ...prev, bio, name, username };
    });
    setEditMode(false);
  }

  function toggleFollow() {
    setIsFollowing((prev) => !prev);
    axios.post("/api/followers", {
      destination: profileInfo?._id,
    });
  }

  return (
    <Layout>
      {!!profileInfo && (
        <div>
          <div className="px-5 pt-2">
            <TopNavLink title={profileInfo.name} />
          </div>
          <Cover src={profileInfo.cover} />
          <div className="flex justify-between">
            <div className="ml-5 relative">
              <div className="absolute -top-12 border-4 rounded-full border-black">
                <Avatar big src={profileInfo.image} />
              </div>
            </div>
            <div className="p-2">
              {isMyProfile ? (
                <div>
                  {!editMode && (
                    <button
                      className="bg-twitterBlue py-2 px-5 rounded-full"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </button>
                  )}

                  {editMode && (
                    <div>
                      <button
                        className="bg-twitterWhite text-black py-2 px-5 rounded-full"
                        onClick={() => {
                          cancel();
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        className="bg-twitterBlue text-white py-2 px-5 rounded-full"
                        onClick={() => updateProfile()}
                      >
                        Save Profile
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={toggleFollow}
                  className={
                    (isFollowing
                      ? "bg-twitterWhite text-black"
                      : "bg-twitterBlue text-white") + " py-2 px-5 rounded-full"
                  }
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
          <div className="px-5 mt-2">
            {!editMode && (
              <>
                <h1 className="font-bold text-xl leading-5">
                  {profileInfo.name}
                </h1>
                <h2 className="text-twitterLightGray text-sm">
                  @{profileInfo.username}
                </h2>

                <div className="text-sm mt-2 mb-2">{profileInfo?.bio}</div>
              </>
            )}
            {editMode && (
              <>
                <div>
                  <input
                    type="text"
                    value={profileInfo?.name}
                    onChange={(e) =>
                      setProfileInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="bg-twitterBorder p-2 mb-2 rounded-full"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={profileInfo?.username}
                    onChange={(e) =>
                      setProfileInfo((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="bg-twitterBorder p-2 mb-2 rounded-full"
                  />
                </div>
                <div>
                  <textarea
                    type="text"
                    value={profileInfo?.bio}
                    onChange={(e) =>
                      setProfileInfo((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="bg-twitterBorder p-2 mb-2 rounded-2xl w-full block"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {posts?.length > 0 &&
        posts.map((post) => (
          <div className="p-5 border-t border-twitterBorder" key={post._id}>
            <PostContent
              {...post}
              likedByMe={postsLikedByMe.includes(post._id)}
            />
          </div>
        ))}
    </Layout>
  );
}
