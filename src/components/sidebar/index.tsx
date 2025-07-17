import { Logo } from "@/assets/images/logo";
import { SidebarLinks } from "./links";
import { NivelCard } from "../nivel-card";

interface SideBarProps {
  /** Desabilita todos os links (ex.: onboarding) */
  desactived?: boolean;
}

export function SideBar({ desactived = false }: SideBarProps) {
  return (
    <aside className="w-[220px] 3xl:w-[264px] h-screen">
      <div className="bg-neutral-0 fixed w-[220px] 3xl:w-[264px] h-screen flex flex-col">
          <div className="px-6 py-5">
            <Logo
              variant="blue"
              withText={desactived}
              className={`
            ${desactived ? "w-[160px] h-[40px] 3xl:w-[180px] 3xl:h-[48px]" : "w-[125px] h-[48px] 3xl:w-[140px] 3xl:h-[54px]"}`}
            />
          </div>

          <div className="flex-1 py-2 px-6 overflow-y-auto">
            <SidebarLinks desactived={desactived} />
          </div>

        <div className="px-4 pb-6">
          <NivelCard variant="silver" />
        </div>
      </div>
    </aside>
  );
}
