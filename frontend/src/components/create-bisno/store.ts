import { createStore } from "@tanstack/react-store";

interface IStepWhat {
  serviceId: string | undefined;
  zoneId: string | undefined;
}

interface IStepDescription {
  description: string | undefined;
}

interface IStepContact {
  mobile: string | undefined;
  customerName: string | undefined;
  channel: "whatsapp" | "mobile" | undefined;
}

export interface StoreSteps {
  step: number;
  stepWhat: IStepWhat | undefined;
  stepDescription: IStepDescription | undefined;
  stepContact: IStepContact | undefined;
}

const INITIAL_VALUES: StoreSteps = {
  step: 1,
  stepWhat: undefined,
  stepDescription: undefined,
  stepContact: {
    channel: "whatsapp",
    mobile: undefined,
    customerName: undefined,
  },
};

export const store = createStore<StoreSteps>(INITIAL_VALUES);

export const updateStepWhatState = (what: Partial<IStepWhat>) => {
  store.setState((prev) => ({
    ...prev,
    stepWhat: {
      serviceId:
        "serviceId" in what ? what.serviceId : prev.stepWhat?.serviceId,
      zoneId: "zoneId" in what ? what.zoneId : prev.stepWhat?.zoneId,
    },
  }));
};

export const updateStepDescriptionState = (
  description: Partial<IStepDescription>,
) => {
  store.setState((prev) => ({
    ...prev,
    stepDescription: {
      description:
        "description" in description
          ? description.description
          : prev.stepDescription?.description,
    },
  }));
};

export const updateStepContactState = (contact: Partial<IStepContact>) => {
  store.setState((prev) => ({
    ...prev,
    stepContact: {
      mobile: "mobile" in contact ? contact.mobile : prev.stepContact?.mobile,
      customerName:
        "customerName" in contact
          ? contact.customerName
          : prev.stepContact?.customerName,
      channel:
        "channel" in contact ? contact.channel : prev.stepContact?.channel,
    },
  }));
};

export const changeStep = (step: number) => {
  store.setState((prev) => ({
    ...prev,
    step: step,
  }));
};

export const resetBisnoStore = () => {
  store.setState(() => INITIAL_VALUES);
};
