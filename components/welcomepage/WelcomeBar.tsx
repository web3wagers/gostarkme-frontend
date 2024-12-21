import Image from "next/image";
import { LinkButton } from "../ui/LinkButton";

export const WelcomeBar = () => {
  const ROOT = process.env.NEXT_PUBLIC_APP_ROOT;

  return (
    <nav className="sticky bg-white top-0 w-full z-20 border-b border-darkblue p-2">
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 py-3">
        {/* Placeholder or Spacer */}
        <span className="hidden md:block w-20 md:w-28" />

        {/* Logo and Title */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-center md:text-left">
          <Image
            src={ROOT + "icons/starklogo.png"}
            alt="stark logo"
            width={30}
            height={30}
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <h1 className="text-lg md:text-xl font-semibold">Go Stark Me</h1>
        </div>

        {/* Link Button */}
        <div className="mt-2 md:mt-0">
          <LinkButton
            label="Go to app"
            href="/app"
          />
        </div>
      </div>
    </nav>
  );
};
