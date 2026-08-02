import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const AuthRootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-12 sm:px-6">
        {children}
      </div>
    </div>
  );
};

export default AuthRootLayout;
