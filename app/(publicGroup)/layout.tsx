import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getMe } from "@/service/getMe";

const PublicRootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();
  return (
    <div>
      <Navbar user={user} />
      {children}
      <Footer />
    </div>
  );
};

export default PublicRootLayout;
