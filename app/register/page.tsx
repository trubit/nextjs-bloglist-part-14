import Link from "next/link";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <div>
      <h2>create account</h2>
      <RegisterForm />
      <p>
        <Link href="/login">already have an account? log in</Link>
      </p>
    </div>
  );
}
