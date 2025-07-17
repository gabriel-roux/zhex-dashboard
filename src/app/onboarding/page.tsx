"use client";

import { Container } from "@/components/container";
import { useState } from "react";

import { Button } from "@/components/button";
import { ProgressBar } from "./progress-bar";
import { InitOnboarding } from "./verify";
import { BusinessForm } from "./verify/business-form";
import { RepresentativesForm } from "./verify/representatives-form";
import BankForm from "./verify/bank-form";
import { OperationRisk } from "./verify/operation-risk-form";
import { SignatureForm } from "./verify/signature-form";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      label: "Perfil",
      completed: true,
    },
    {
      label: "Detalhes da Empresa",
      completed: false,
    },
    {
      label: "Detalhes dos Representantes",
      completed: false,
    },
    {
      label: "Conta Bancária",
      completed: false,
    },
    {
      label: "Risco de Operação",
      completed: false,
    },
    {
      label: "Assinatura",
      completed: false,
    },
  ];

  const step = () => {
    switch (currentStep) {
      case 0:
        return <InitOnboarding />;
      case 1:
        return <BusinessForm />;
      case 2:
        return <RepresentativesForm />;
      case 3:
        return <BankForm />;
      case 4:
        return <OperationRisk />;
      case 5:
        return <SignatureForm />;
      default:
        return <InitOnboarding />;
    }
  };

  return (
    <Container>
      <div className="w-full bg-white rounded-lg py-6 px-5 mb-10">
        <ProgressBar steps={steps} currentStep={currentStep} />

        {step()}

        <div className="flex items-center gap-4 mt-8">
          <Button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            variant="ghost"
            size="large"
            className="w-[222px]"
          >
            Voltar
          </Button>
          <Button
            size="large"
            onClick={() => setCurrentStep((prev) => prev + 1)}
            disabled={currentStep >= steps.length - 1}
            variant="primary"
            className="w-[222px]"
          >
            Continuar
          </Button>
        </div>
      </div>
    </Container>
  );
}
