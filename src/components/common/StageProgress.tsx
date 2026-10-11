import { useTranslations } from 'next-intl';
import type { StageNumber } from '@/types/domain';
import { StepProgress } from './StepProgress';

export const STAGE_COUNT = 12;

export function StageProgress({ stage, className }: { stage: StageNumber; className?: string }) {
  const t = useTranslations('journey');
  const name = (number: number) => t(`stages.${number}` as `stages.1`);
  return (
    <StepProgress
      current={stage}
      total={STAGE_COUNT}
      label={t('stageOf', { stage, total: STAGE_COUNT, name: name(stage) })}
      nextLabel={stage < STAGE_COUNT ? t('next', { name: name(stage + 1) }) : undefined}
      stepNames={Array.from({ length: STAGE_COUNT }, (_, index) => name(index + 1))}
      ariaLabel={t('progressLabel')}
      className={className}
    />
  );
}
