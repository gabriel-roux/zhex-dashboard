'use client'

import { StarIcon, ThumbsDownIcon, ThumbsUpIcon, UserIcon } from '@phosphor-icons/react'

interface TestimonialPreviewProps {
  testimonial: {
    id: string
    profileImage?: string
    starRating: string
    name: string
    socialNetwork?: string
    text: string
  }
  colors: {
    nameColor: string
    textColor: string
    cardColor: string
    borderColor: string
    starsColor: string
    backgroundColor: string
  }
}

export function TestimonialPreview({ testimonial, colors }: TestimonialPreviewProps) {
  return (
    <div
      className="p-3 rounded-lg border w-full"
      style={{
        backgroundColor: colors.cardColor,
        borderColor: colors.borderColor,
      }}
    >
      {/* Estrelas */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: parseInt(testimonial.starRating) }, (_, i) => (
            <span
              key={i}
              style={{ color: colors.starsColor }}
              className="text-lg"
            >
              <StarIcon size={20} weight="fill" color={colors.starsColor} />
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <button type="button" className="text-neutral-400 rounded-full">
            <ThumbsUpIcon size={20} weight="bold" />
          </button>
          <button type="button" className="text-neutral-400 rounded-full">
            <ThumbsDownIcon size={20} weight="bold" />
          </button>
        </div>
      </div>

      {/* Texto do depoimento */}
      <p
        className="text-sm mb-3 leading-relaxed font-araboto font-medium"
        style={{ color: colors.textColor }}
      >
        {testimonial.text || '-'}
      </p>

      {/* Informações do autor */}
      <div className="flex items-center gap-2">
        {/* Foto do perfil */}
        {testimonial.profileImage
          ? (
            <img
              src={testimonial.profileImage}
              alt={testimonial.name}
              className="w-9 h-9 rounded-full object-cover"
            />
            )
          : (
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center">
              <span className="text-neutral-500 text-sm">
                <UserIcon size={20} className="text-neutral-500" />
              </span>
            </div>
            )}

        {/* Nome e rede social */}
        <div className="flex flex-col">
          <span
            className="font-medium text-sm"
            style={{ color: colors.nameColor }}
          >
            {testimonial.name}
          </span>
          {testimonial.socialNetwork && (
            <span
              className="text-xs"
              style={{ color: colors.textColor }}
            >
              {testimonial.socialNetwork}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
