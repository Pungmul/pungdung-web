"use client";

import { useCallback, useMemo, useState } from "react";

import { useFormContext, useWatch } from "react-hook-form";

import type { LocationType } from "@/features/location";

import {
  LIGHTNING_CREATE_FORM_FIELD,
  LIGHTNING_CREATE_STEP_FIELD,
} from "../../constants";
import { useLightningBuildContext } from "../../providers";
import { zodIssuesToStepFieldMessages } from "../../services";
import {
  type LightningCreateFormData,
  lightningSelectLocationStepSchema,
} from "../../types/schemas";

const FIELDS = LIGHTNING_CREATE_FORM_FIELD;
const STEP_FIELDS = LIGHTNING_CREATE_STEP_FIELD.SELECT_LOCATION;

export const useSelectLocationStepForm = () => {
  const form = useFormContext<LightningCreateFormData>();
  const { setBuildStep } = useLightningBuildContext();
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [detailAddressRaw, locationPoint, address] = useWatch({
    control: form.control,
    name: [FIELDS.DETAIL_ADDRESS, FIELDS.LOCATION_POINT, FIELDS.ADDRESS],
  });
  const detailAddress = detailAddressRaw ?? "";

  const initialLocation = useMemo((): LocationType | null => {
    if (!locationPoint?.latitude || !locationPoint?.longitude) {
      return null;
    }

    return {
      latitude: locationPoint.latitude,
      longitude: locationPoint.longitude,
    };
  }, [locationPoint]);

  const handleLocationChange = useCallback(
    (location: LocationType, address: string) => {
      form.setValue(FIELDS.ADDRESS, address, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue(FIELDS.LOCATION_POINT, location, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [form]
  );

  const updateDetailAddress = (nextDetailAddress: string) => {
    form.setValue(FIELDS.DETAIL_ADDRESS, nextDetailAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const parsedStep = useMemo(() => {
    const result = lightningSelectLocationStepSchema.safeParse({
      [FIELDS.ADDRESS]: address ?? "",
      [FIELDS.LOCATION_POINT]: locationPoint ?? null,
    });

    if (result.success) {
      return {
        fieldErrors: {} as Partial<Record<(typeof STEP_FIELDS)[number], string>>,
        isStepValueValid: true,
      };
    }

    return {
      fieldErrors: zodIssuesToStepFieldMessages(result.error, [...STEP_FIELDS]),
      isStepValueValid: false,
    };
  }, [address, locationPoint]);

  const fieldErrors = showValidationErrors ? parsedStep.fieldErrors : {};
  const isNextDisabled =
    showValidationErrors && !parsedStep.isStepValueValid;

  const submitSelectLocationStep = async () => {
    const isValid = await form.trigger([...STEP_FIELDS]);
    if (!isValid) {
      setShowValidationErrors(true);
      return;
    }
    setBuildStep("SelectTimeAndPersonnel");
  };

  return {
    detailAddress,
    fieldErrors,
    handleLocationChange,
    initialLocation,
    isNextDisabled,
    submitSelectLocationStep,
    updateDetailAddress,
  };
};
