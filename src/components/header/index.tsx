import {
  CirclesFourIcon,
  MagnifyingGlassIcon,
  BellIcon,
  CaretDownIcon,
  ImageSquareIcon,
} from "@phosphor-icons/react/ssr";

interface HeaderProps {
  /** Desabilita todos os links (ex.: onboarding) */
  desactived?: boolean;
}

export function Header({ desactived = false }: HeaderProps) {
  return (
    <header className="mx-auto w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl mt-4 h-16">
      <div
        className="
          fixed top-4
          left-[calc(50%+122px)]
          -translate-x-1/2
          w-full md:max-w-screen-lg 2xl:max-w-screen-xl 3xl:max-w-screen-2xl
          bg-neutral-0 h-16 border border-neutral-100 rounded-lg
          flex items-center gap-6 px-6 justify-between
          z-50
        "
      >
        {/* Breadcrumb / page title */}
        <div className={`flex items-center gap-3 ${desactived ? 'text-neutral-1000/30' : 'text-neutral-1000'}`}>
          <CirclesFourIcon size={20} weight="regular" className="-mt-1" />
          <span className="font-araboto font-medium text-base">Dashboard</span>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-5">
          <div className="relative max-w-md mx-auto cursor-pointer">
            <MagnifyingGlassIcon
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-300"
            />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full h-10 pl-10 pr-3 rounded-lg bg-neutral-0 border border-neutral-200 placeholder:text-neutral-300 text-neutral-900 outline-none focus:ring-1 focus:ring-zhex-base-500 transition-all duration-300"
            />
          </div>

          {/* Notification icon */}
          <button
            type="button"
            aria-label="Notificações"
            className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-200"
          >
            <BellIcon size={18} className="text-neutral-400" />
            {/* Dot indicator */}
            {/* <span className="absolute top-1.5 right-1.5 inline-block w-2 h-2 bg-red-secondary-500 rounded-full" /> */}
          </button>

          {/* Company selector */}
          <button
            type="button"
            className="flex items-center gap-2 h-10 px-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-neutral-25 flex items-center justify-center border border-neutral-300">
              <ImageSquareIcon size={14} className="text-neutral-700" />
            </div>
            <span className="text-neutral-900 font-araboto text-sm">
              Sua empresa aqui
            </span>
            <CaretDownIcon size={14} className="text-neutral-400" />
          </button>
        </div>
      </div>
    </header>
  );
}
