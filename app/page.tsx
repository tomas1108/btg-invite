import Image from "next/image";

export default function Home() {
  return (
    <>
    <div className="flex min-h-screen items-center bg-black justify-center flex-col gap-8 relative overflow-hidden">
      <Image src="/images/logo/logoBTG.png" alt="Logo" width={426} height={586} />
    </div>
    </>
  );
}
