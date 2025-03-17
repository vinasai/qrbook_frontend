import AnimatedRegisterForm from "../components/animated-register-form";
import BackgroundPaths from "@/components/background-paths";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <BackgroundPaths />
      <div className="w-full max-w-sm">
        <AnimatedRegisterForm />
      </div>
    </div>
  );
}
