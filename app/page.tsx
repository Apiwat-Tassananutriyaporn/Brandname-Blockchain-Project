// app/page.tsx
import RegisterPage from "./register/page";
import LoginPage from "./login/page";
import AdminPage from "./Allpage/Admin/page";

export default function Home() {
  // ให้หน้าแรกแสดงส่วนของ Register เป็นอันดับแรก
  return (
    <main>
      <RegisterPage />
    </main>
  );
}