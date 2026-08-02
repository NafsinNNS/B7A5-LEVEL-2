import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const DashboardRootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = await getMe();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={user} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardRootLayout;
