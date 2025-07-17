import { Logo } from "@/assets/images/logo";
import LoginImg from "@/assets/images/login-sidebar-widgets.png";
import Grid from "@/assets/images/login-grid.png";
import Image from "next/image";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="md:max-w-screen-xl 3xl:max-w-screen-2xl mx-auto w-full md:pt-16 3xl:pt-40 h-full">
      <section className="flex items-center justify-between gap-32 p-4">
        <div className="flex flex-col items-center gap-3 min-w-[420px] -mt-6">
          <Logo variant="blue" className="w-[140px]" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl 3xl:text-3xl text-center font-araboto font-medium text-neutral-950">
              Seja bem vindo, novamente!
            </h1>
            <p className="text-neutral-700 text-center font-araboto">
              Simplifique suas vendas, expanda seus horizontes e gerencie
              pagamentos globais com total transparência.
            </p>
          </div>

          <LoginForm />
        </div>
        <div className="flex items-center md:min-w-[778px] md:h-[705px] 3xl:min-w-[898px] 3xl:h-[800px] relative">
          {/* Highlight copy over the illustration */}
          <div
            className="absolute top-3 left-6 flex flex-col gap-2
                       p-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-[3px] h-5 bg-blue-500 rounded-full"></div>
              <h2 className="text-xl font-araboto font-semibold text-neutral-950 leading-tight">
                Precisão suíça nos seus pagamentos
              </h2>
            </div>
            <p className="text-neutral-700 text-sm font-araboto md:text-base leading-relaxed max-w-[700px]">
              Relatórios em tempo real, reconciliação automática e zero
              surpresas: tudo funcionando no ritmo perfeito.
            </p>
          </div>
          <Image
            src={LoginImg}
            className="w-full h-full object-cover"
            alt="Login Illustration"
          />
        </div>
      </section>

      <Image
        src={Grid}
        className="absolute top-0 left-0 w-full h-full -z-10 object-contain"
        alt="Background Grid"
      />
    </main>
  );
}
