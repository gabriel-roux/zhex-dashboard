'use client'

import { TextField } from '@/components/textfield'
import { Switch } from '@/components/switch'
import {
  InfoIcon,
} from '@phosphor-icons/react'
import clsx from 'clsx'
import { UploadButton } from './upload-button'
import { ColorPicker } from '@/components/color-picker'
import { CheckoutCard } from './card'
import { UseFormReturn } from 'react-hook-form'
import { CheckoutLayoutFormData } from '@/hooks/useCheckoutLayoutForm'
import { ProductClass, ProductProps } from '@/@types/product'

interface CheckoutLayoutProps {
  product?: ProductProps
  form: UseFormReturn<CheckoutLayoutFormData>
  selectedBannerLayout: 'LAYOUT_1' | 'LAYOUT_2' | 'LAYOUT_3'
  onBannerLayoutChange: (layout: 'LAYOUT_1' | 'LAYOUT_2' | 'LAYOUT_3') => void
  onFileSelect?: (imageType: 'favicon' | 'mainBanner' | 'sideBanner' | 'background', file: File) => void
}

export function CheckoutLayout({ product, form, selectedBannerLayout, onBannerLayoutChange, onFileSelect }: CheckoutLayoutProps) {
  const { register, formState: { errors }, watch, setValue } = form

  return (
    <div className="space-y-8">
      {/* Nome do checkout */}
      <div>
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
          Nome do checkout:
        </label>
        <TextField
          {...register('name')}
          placeholder="Digite o nome do checkout"
          error={errors.name?.message}
        />
      </div>

      {/* Título */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
            Título:
          </label>
          <TextField
            {...register('title')}
            placeholder="Digite o título da page"
            error={errors.title?.message}
          />
        </div>

        {/* Favicon */}
        <div>
          <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
            Favicon:
          </label>
          <UploadButton
            onUpload={(url) => setValue('faviconUrl', url)}
            onFileSelect={onFileSelect
              ? (file) => onFileSelect('favicon', file)
              : undefined}
            currentImage={watch('faviconUrl') || ''}
            onRemove={() => setValue('faviconUrl', '')}
          />
          <p className="text-neutral-600 text-sm mt-2 flex items-center gap-2">
            <InfoIcon size={18} className="text-zhex-base-500" />
            Arquivo JPEG ou PNG até 5MB
          </p>
        </div>
      </div>

      {/* Habilitar inputs para preenchimento */}
      <div>
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
          Habilitar inputs para preenchimento:
        </label>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Switch
              active={watch('requireEmailConfirmation')}
              setValue={(checked) => setValue('requireEmailConfirmation', checked)}
            />
            <div className="flex items-center gap-1">
              <span className="text-neutral-1000 font-araboto mt-1">Confirmar e-mail</span>
              <InfoIcon size={18} className="text-zhex-base-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              active={watch('requireDocument')}
              setValue={(checked) => setValue('requireDocument', checked)}
            />
            <div className="flex items-center gap-1">
              <span className="text-neutral-1000 font-araboto mt-1">CPF/CNPJ</span>
              <InfoIcon size={18} className="text-zhex-base-500" />
            </div>
          </div>
          {product?.productClass !== ProductClass.PHYSICAL && (
            <div className="flex items-center gap-2">
              <Switch
                active={watch('requireAddress')}
                setValue={(checked) => setValue('requireAddress', checked)}
              />
              <div className="flex items-center gap-1">
                <span className="text-neutral-1000 font-araboto mt-1">Endereço</span>
                <InfoIcon size={18} className="text-zhex-base-500" />
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Switch
              active={watch('requireCoupon')}
              setValue={(checked) => setValue('requireCoupon', checked)}
            />
            <div className="flex items-center gap-1">
              <span className="text-neutral-1000 font-araboto mt-1">Cupom</span>
              <InfoIcon size={18} className="text-zhex-base-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Banners */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Switch
            active={watch('enableBanner')}
            setValue={(checked) => setValue('enableBanner', checked)}
          />
          <label className="text-neutral-1000 font-medium font-araboto text-lg block">
            Banners:
          </label>
        </div>

        {watch('enableBanner') && (
          <div className="grid grid-cols-3 gap-4 mb-6 max-w-[395px]">
            {/* Layout 1 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onBannerLayoutChange('LAYOUT_1')}
                className={`w-[116px] h-[116px] p-3 border-2 bg-zhex-base-500/5 border-dashed rounded-lg transition-all duration-300 ${
                  selectedBannerLayout === 'LAYOUT_1'
                    ? 'border-zhex-base-500'
                    : 'border-zhex-base-500/20'
                }`}
              >
                <div className="w-full h-full flex flex-col gap-1.5">
                  {/* Main Banner */}
                  <div className="w-full h-8 bg-zhex-base-500/20 border border-dashed border-zhex-base-400 rounded" />
                  {/* Side Banner */}
                  <div className="flex gap-1">
                    <div className="flex-1 bg-transparent" />
                    <div className="w-7 h-[56px] bg-zhex-base-500/20 border border-dashed border-zhex-base-400 rounded" />
                  </div>
                </div>
              </button>
              <div className="mt-2">
                <button
                  type="button"
                  className={
                    clsx(
                      'w-4 h-4 border-2 border-zhex-base-500 rounded-full relative before:content-[""] before:absolute before:w-2 before:h-2 before:bg-zhex-base-500 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 before:transition-opacity',
                      selectedBannerLayout === 'LAYOUT_1' && 'before:opacity-100',
                    )
                  }
                  onClick={() => onBannerLayoutChange('LAYOUT_1')}
                />
              </div>
            </div>

            {/* Layout 2 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onBannerLayoutChange('LAYOUT_2')}
                className={`w-[116px] h-[116px] p-3 border-2 bg-zhex-base-500/5 border-dashed rounded-lg transition-all duration-300 ${
                  selectedBannerLayout === 'LAYOUT_2'
                    ? 'border-zhex-base-500'
                    : 'border-zhex-base-500/20'
                }`}
              >
                <div className="w-full h-full flex flex-col">
                  {/* Main Banner */}
                  <div className="w-full h-8 bg-zhex-base-500/20 border border-dashed border-zhex-base-400 rounded" />
                  {/* Empty space */}
                  <div className="flex-1 bg-transparent" />
                </div>
              </button>
              <div className="mt-2">
                <button
                  type="button"
                  className={
                    clsx(
                      'w-4 h-4 border-2 border-zhex-base-500 rounded-full relative before:content-[""] before:absolute before:w-2 before:h-2 before:bg-zhex-base-500 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 before:transition-opacity',
                      selectedBannerLayout === 'LAYOUT_2' && 'before:opacity-100',
                    )
                  }
                  onClick={() => onBannerLayoutChange('LAYOUT_2')}
                />
              </div>
            </div>

            {/* Layout 3 */}
            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => onBannerLayoutChange('LAYOUT_3')}
                className={`w-[116px] h-[116px] p-3 border-2 bg-zhex-base-500/5 border-dashed rounded-lg transition-all duration-300 ${
                  selectedBannerLayout === 'LAYOUT_3'
                    ? 'border-zhex-base-500'
                    : 'border-zhex-base-500/20'
                }`}
              >
                <div className="w-full h-full flex flex-col gap-1.5 items-end">
                  {/* Empty space */}
                  <div className="w-full h-7 bg-transparent" />
                  {/* Side Banner */}
                  <div className="w-7 h-[56px] bg-zhex-base-500/20 border border-dashed border-zhex-base-400 rounded flex-shrink-0" />
                </div>
              </button>
              <div className="mt-2">
                <button
                  type="button"
                  className={
                    clsx(
                      'w-4 h-4 border-2 border-zhex-base-500 rounded-full relative before:content-[""] before:absolute before:w-2 before:h-2 before:bg-zhex-base-500 before:rounded-full before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-0 before:transition-opacity',
                      selectedBannerLayout === 'LAYOUT_3' && 'before:opacity-100',
                    )
                  }
                  onClick={() => onBannerLayoutChange('LAYOUT_3')}
                />
              </div>
            </div>
          </div>
        )}

        {/* Upload de banners */}
        {watch('enableBanner') && (
          <div className="flex items-center gap-5">
            <div>
              <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                Imagem do banner acima:
              </label>
              <UploadButton
                onUpload={(url) => setValue('mainBannerUrl', url)}
                currentImage={watch('mainBannerUrl') || ''}
                onFileSelect={onFileSelect
                  ? (file) => onFileSelect('mainBanner', file)
                  : undefined}
                onRemove={() => setValue('mainBannerUrl', '')}
              />
              <p className="text-neutral-600 text-sm mt-2 flex items-center gap-2">
                <InfoIcon size={18} className="text-zhex-base-500 flex-shrink-0" />
                Necessário ser JPEG ou PNG e ter 1920 x 1280 px e no máximo 300 MB.
              </p>
            </div>

            <div>
              <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
                Imagem do banner ao lado:
              </label>
              <UploadButton
                onUpload={(url) => setValue('sideBannerUrl', url)}
                currentImage={watch('sideBannerUrl') || ''}
                onFileSelect={onFileSelect
                  ? (file) => onFileSelect('sideBanner', file)
                  : undefined}
                onRemove={() => setValue('sideBannerUrl', '')}
              />
              <p className="text-neutral-600 text-sm mt-2 flex items-center gap-2">
                <InfoIcon size={18} className="text-zhex-base-500 flex-shrink-0" />
                Necessário ser JPEG ou PNG e ter 300 x 300 px e no máximo 300 MB.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Background */}
      <div className="space-y-4">
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-2 block">
          Cores do checkout:
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor do Background:
            </label>
            <ColorPicker
              value={watch('backgroundColor')}
              onChange={(color) => setValue('backgroundColor', color)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Adicionar imagem de fundo:
            </label>
            <UploadButton
              onUpload={(url) => setValue('backgroundImageUrl', url)}
              currentImage={watch('backgroundImageUrl') || ''}
              onFileSelect={onFileSelect
                ? (file) => onFileSelect('background', file)
                : undefined}
              onRemove={() => setValue('backgroundImageUrl', '')}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-neutral-1000 font-medium font-araboto text-base block">
            Cor primária:
          </label>
          <ColorPicker
            value={watch('primaryColor')}
            onChange={(color) => setValue('primaryColor', color)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor da caixa:
            </label>
            <ColorPicker
              value={watch('boxColor')}
              onChange={(color) => setValue('boxColor', color)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor da borda da caixa:
            </label>
            <ColorPicker
              value={watch('boxBorderColor')}
              onChange={(color) => setValue('boxBorderColor', color)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor do texto primário:
            </label>
            <ColorPicker
              value={watch('primaryTextColor')}
              onChange={(color) => setValue('primaryTextColor', color)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor do texto secundário:
            </label>
            <ColorPicker
              value={watch('secondaryTextColor')}
              onChange={(color) => setValue('secondaryTextColor', color)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor do input:
            </label>
            <ColorPicker
              value={watch('inputColor')}
              onChange={(color) => setValue('inputColor', color)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-neutral-1000 font-medium font-araboto text-base block">
              Cor da borda do input:
            </label>
            <ColorPicker
              value={watch('inputBorderColor')}
              onChange={(color) => setValue('inputBorderColor', color)}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-neutral-1000 font-medium font-araboto text-base mb-4 block">
          Personalizar cartão:
        </label>
        <div className="grid grid-cols-3 gap-2 mb-4 max-w-[575px]">
          <CheckoutCard
            cardVariant="CARD_1" colors={{
              cardColor: watch('cardColor'),
              secondaryCardColor: watch('secondaryCardColor'),
              placeholderColor: watch('placeholderColor'),
              chipColor: watch('chipColor'),
              selectColor: watch('selectColor'),
              securityCodeColor: watch('securityCodeColor'),
            }}
          />
          <CheckoutCard
            cardVariant="CARD_2" colors={{
              cardColor: watch('cardColor'),
              secondaryCardColor: watch('secondaryCardColor'),
              placeholderColor: watch('placeholderColor'),
              chipColor: watch('chipColor'),
              selectColor: watch('selectColor'),
              securityCodeColor: watch('securityCodeColor'),
            }}
          />
          <CheckoutCard
            cardVariant="CARD_3" colors={{
              cardColor: watch('cardColor'),
              secondaryCardColor: watch('secondaryCardColor'),
              placeholderColor: watch('placeholderColor'),
              chipColor: watch('chipColor'),
              selectColor: watch('selectColor'),
              securityCodeColor: watch('securityCodeColor'),
            }}
          />
        </div>
        <div className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do background:
              </label>
              <ColorPicker
                value={watch('cardColor')}
                onChange={(color) => setValue('cardColor', color)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do background secundário:
              </label>
              <ColorPicker
                value={watch('secondaryCardColor')}
                onChange={(color) => setValue('secondaryCardColor', color)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do placeholder:
              </label>
              <ColorPicker
                value={watch('placeholderColor')}
                onChange={(color) => setValue('placeholderColor', color)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do chip:
              </label>
              <ColorPicker
                value={watch('chipColor')}
                onChange={(color) => setValue('chipColor', color)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Cor do select:
              </label>
              <ColorPicker
                value={watch('selectColor')}
                onChange={(color) => setValue('selectColor', color)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-neutral-1000 font-medium font-araboto text-base block">
                Código de segurança:
              </label>
              <ColorPicker
                value={watch('securityCodeColor')}
                onChange={(color) => setValue('securityCodeColor', color)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
