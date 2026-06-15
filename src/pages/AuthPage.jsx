import AuthSidebar from "../components/AuthSideBar";
import AuthMain from "../components/AuthMain";

const AuthPage = () => {
  return (
    <div className="flex w-full h-screen bg-[#080c14] overflow-hidden">
      <AuthSidebar />
      <AuthMain />
    </div>
  );
};

export default AuthPage;
