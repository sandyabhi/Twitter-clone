import { useRouter } from "next/router";
import Layout from "../components/Layout";
import TopNavLink from "../components/TopNavLink";

export default function UserPage() {
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {}, [username]);

  return (
    <Layout>
      <div className="px-5 pt-2">
        <TopNavLink title={username} />
      </div>
      {username}
    </Layout>
  );
}
