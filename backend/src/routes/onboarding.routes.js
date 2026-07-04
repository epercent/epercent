import { Router } from 'express';

import {
  getDataFeedRequirements,
  getDataFeedRequirementsForEnterprise,
  getDigitalMirror,
  getDigitalMirrors,
  getDtaCandidate,
  getDtaCandidates,
  getHumanValidation,
  getHumanValidationForEnterprise,
  getOnboarding,
  getOnboardingAssimilationOverview,
  getOnboardingById,
  getOnboardingPipeline
} from '../controllers/onboarding.controller.js';

export const onboardingRouter = Router();
export const digitalMirrorsRouter = Router();
export const dtaCandidatesRouter = Router();
export const dataFeedRequirementsRouter = Router();
export const humanValidationRouter = Router();
export const onboardingAssimilationRouter = Router();

onboardingRouter.get('/', getOnboarding);
onboardingRouter.get('/:id', getOnboardingById);
onboardingRouter.get('/:id/pipeline', getOnboardingPipeline);

digitalMirrorsRouter.get('/', getDigitalMirrors);
digitalMirrorsRouter.get('/:id', getDigitalMirror);

dtaCandidatesRouter.get('/', getDtaCandidates);
dtaCandidatesRouter.get('/:id', getDtaCandidate);

dataFeedRequirementsRouter.get('/', getDataFeedRequirements);
dataFeedRequirementsRouter.get('/:enterpriseId', getDataFeedRequirementsForEnterprise);

humanValidationRouter.get('/', getHumanValidation);
humanValidationRouter.get('/:enterpriseId', getHumanValidationForEnterprise);

onboardingAssimilationRouter.get('/', getOnboardingAssimilationOverview);
