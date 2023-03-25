import { useState } from "react";

type Step = {
  label: string;
  component: JSX.Element | null | undefined;
};

interface FormValues {
  [key: string]: any;
}

const useStepsForm = (initialSteps: Step[], initialValues: FormValues) => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormValues((prev) => {
      console.log("prev", prev);
      const newFormValues = { ...prev, [e.target.name]: e.target.value };
      console.log("newFormValues", newFormValues);
      return newFormValues;
    });
  };

  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const goToStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const getCurrentStep = () => {
    return steps[currentStepIndex];
  };

  const isLastStep = () => {
    return currentStepIndex === steps.length - 1;
  };

  const isFirstStep = () => {
    return currentStepIndex === 0;
  };

  const resetSteps = () => {
    setCurrentStepIndex(0);
  };

  return {
    steps,
    setSteps,
    currentStepIndex,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    getCurrentStep,
    isLastStep,
    isFirstStep,
    resetSteps,
    handleInputChange,
    formValues,
  };
};

export default useStepsForm;
