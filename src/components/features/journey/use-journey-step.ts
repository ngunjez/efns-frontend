'use client';

import { useRouter } from 'next/navigation';
import { useCustomerAction } from '@/api/hooks/use-customer-display';
import { journeySteps } from '@/config/journey';
import type { JourneyStep } from '@/types/journey';

export function useJourneyStep(step: JourneyStep) {
  const router = useRouter();
  const action = useCustomerAction();
  const next = journeySteps[step].next;

  const advance = (name: string, payload?: Record<string, unknown>) =>
    action.mutate(
      { step, action: name, payload },
      { onSuccess: () => next && router.push(`/hub/${next}`) },
    );

  return { advance, pending: action.isPending };
}
