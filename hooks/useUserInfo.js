import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function useUserInfo() {
  const { data: session, status: sessionStatus } = useSession();
  const [userInfo, setUserInfo] = useState();
  const [status, setStatus] = useState("loading");

  function getUserInfo() {
    if (sessionStatus === "loading") return;

    console.log(session);
    fetch("/api/users?id=" + session.user.id).then((response) => {
      response.json().then((json) => {
        // console.log({ json });
        setUserInfo(json.user);
        setStatus("done");
      });
    });
  }

  useEffect(() => {
    getUserInfo();
  }, [sessionStatus]);

  return { userInfo, status };
}
