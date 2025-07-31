import Image from 'next/image'
import { useAuth } from '@/contexts/auth/context'

export function UserInformations() {
  const { user } = useAuth()

  const status = user?.isActive
    ? !user.emailVerified
        ? 'Email não verificado'
        : 'Ativo'
    : 'Inativo'

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'Ativo':
        return {
          bgColor: 'bg-green-secondary-500/20',
          dotColor: 'bg-green-500',
          textColor: 'text-green-600',
        }
      case 'Email não verificado':
        return {
          bgColor: 'bg-yellow-500/20',
          dotColor: 'bg-yellow-500',
          textColor: 'text-yellow-600',
        }
      case 'Inativo':
        return {
          bgColor: 'bg-neutral-500/20',
          dotColor: 'bg-neutral-500',
          textColor: 'text-neutral-600',
        }
      default:
        return {
          bgColor: 'bg-neutral-500/20',
          dotColor: 'bg-neutral-500',
          textColor: 'text-neutral-600',
        }
    }
  }

  const statusConfig = getStatusConfig(status)

  return (
    <div className="flex items-center justify-between gap-6 w-full mt-4">
      {/* Left Section - Product Card */}
      <div className="flex items-center gap-6">
        <div className="w-[140px] min-h-[140px] flex-shrink-0">
          <div className="bg-neutral-50 rounded-2xl p-4 h-[140px] w-full shadow-sm border-2 border-dashed justify-center items-center flex border-neutral-200">
            <Image
              src={
              user?.avatarUrl || ''
            } alt="Product Cover" width={120} height={120} className="object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Middle Section - Product Details */}
        <div className="">
          {/* Status */}
          <div className={`flex items-center gap-2 mb-2 rounded-md px-2 py-1 w-fit ${
            statusConfig.bgColor
          }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              statusConfig.dotColor
            }`}
            />
            <span className={`text-sm font-medium ${
              statusConfig.textColor
            }`}
            >
              {status}
            </span>
          </div>

          {/* Product Title */}
          <h2 className="text-xl font-araboto font-bold text-neutral-1000 mt-2">
            {user?.firstName} {user?.lastName}
          </h2>

          {/* Product Description */}
          <p className="text-neutral-600 text-base leading-relaxed">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Right Section - Sales Analytics */}
      <div className="w-[380px] max-h-[245px] flex-shrink-0" />
    </div>
  )
}
