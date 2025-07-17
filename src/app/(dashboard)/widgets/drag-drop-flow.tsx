"use client";

import { JSX, useState } from "react";
import {
  ArrowsOutCardinalIcon,
  CalendarDotsIcon,
  GearIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { Reorder } from "framer-motion";


import { SubscriptionWidget } from "./subscription-card";
import { ChargebackControlWidget } from "./chargeback-control-card";
import { NetVolumeWidget } from "./net-volume-card";
import { PaymentStatusCard } from "./status-card";
import { PaymentMethods } from "./payment-methodscard";
import { TransactionsWidget } from "./transactions-card";
import { GrossVolumeWidget } from "./gross-volume-card";
import { RefusedVolumeWidget } from "./refused-volume-card";
import { SupportWidget } from "./support-card";
import { TopAffiliatesWidget } from "./top-affiliates";
import { WidgetsModal } from "./widgets-modal";
import * as Dialog from "@radix-ui/react-dialog";

/**
 * Mapeia o id do widget ao componente renderizável.
 */
const widgetMap: Record<string, JSX.Element> = {
  subscription: <SubscriptionWidget />,
  "net-volume": <NetVolumeWidget />,
  "gross-volume": <GrossVolumeWidget />,
  "refused-volume": <RefusedVolumeWidget />,
  status: <PaymentStatusCard />,
  methods: <PaymentMethods />,
  transactions: <TransactionsWidget />,
  chargeback: <ChargebackControlWidget />,
  affiliates: <TopAffiliatesWidget />,
  support: <SupportWidget />,
};

export function DragAndDrop() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [changesMade, setChangesMade] = useState(false);

  /** ordem atual (pode vir da API/localStorage) */
  const [items, setItems] = useState<string[]>([
    "subscription",
    "net-volume",
    "chargeback",
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetIdx, setTargetIdx] = useState<number | null>(null);

  return (
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
      {/* barra de ações */}
      <div className="flex items-center justify-between my-5">
        <button
          onClick={() => {
            if (!isEditing) {
              // entra em modo edição
              setOriginalOrder(items);
              setChangesMade(false);
              setIsEditing(true);
            } else {
              if (changesMade) {
                // salvar — aqui você chamaria a API / persistência
                console.log("Saving new order:", items);
              }
              // sair do modo edição (tanto salvar quanto cancelar)
              setIsEditing(false);
            }
          }}
          className={`flex underline items-center font-araboto font-medium gap-2 transition-all ${
            !isEditing
              ? "text-neutral-1000 hover:text-neutral-900"
              : changesMade
              ? "text-zhex-base-500 hover:text-zhex-base-600"
              : "text-red-secondary-500 hover:text-red-secondary-600"
          }`}
        >
          <GearIcon size={20} weight="bold" className="-mt-0.5" />
          {!isEditing
            ? "Editar Widgets"
            : changesMade
            ? "Salvar Alterações"
            : "Cancelar Edição"}
        </button>

        <button className="w-10 h-10 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-colors flex items-center justify-center">
          <CalendarDotsIcon size={20} />
        </button>
      </div>

      {/* grupo arrastável */}
      <Reorder.Group
        axis="x" // changed from "x" to "xy"
        values={items}
        onReorder={(newOrder) => {
          setItems(newOrder as string[]);
          // verifica se houve mudança em relação à ordem original
          setChangesMade(
            originalOrder.length > 0 &&
              newOrder.some((id, idx) => id !== originalOrder[idx])
          );
        }}
        className="w-full grid grid-cols-3 items-start gap-5 mb-10"
      >
        {items.map((id, idx) => (
          <Reorder.Item
            key={id}
            value={id}
            drag={isEditing} // permite drag apenas em edição
            dragListener={isEditing} // desativa o listener quando não edita
            className={
              "border-2 border-dashed  border-transparent relative" +
              (isEditing
                ? " !border-zhex-base-500 rounded-lg cursor-grab active:cursor-grabbing"
                : "")
            }
            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          >
            {isEditing && (
              <div className="absolute w-full p-4 flex items-center justify-between">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <ArrowsOutCardinalIcon
                    size={24}
                    weight="bold"
                    className="text-zhex-base-500"
                  />
                </button>
                <button
                  onClick={() => {
                    setTargetIdx(idx);
                    setModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-lg text-zhex-base-500 border border-zhex-base-500 flex items-center justify-center hover:bg-zhex-base-500 hover:text-white relative z-[100]"
                >
                  <PlusIcon size={20} weight="bold" />
                </button>
              </div>
            )}

            <div className={isEditing ? "opacity-20" : ""}>{widgetMap[id]}</div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      {modalOpen && (
        <WidgetsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSelect={(wid) => {
            setItems((prev) => {
              if (targetIdx === null) return prev;
              const copy = [...prev];
              copy[targetIdx] = wid;
              return copy;
            });
            setChangesMade(true);
            setModalOpen(false);
          }}
        />
      )}
    </Dialog.Root>
  );
}
