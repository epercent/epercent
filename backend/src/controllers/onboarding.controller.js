import {
  getAssimilationPipelineByOnboardingId,
  getDigitalMirrorById,
  getDtaCandidateById,
  getEnterpriseOnboardingById,
  getOnboardingOverview,
  listDataFeedRequirements,
  listDataFeedRequirementsByEnterpriseId,
  listDigitalMirrors,
  listDtaCandidates,
  listEnterpriseOnboarding,
  listHumanValidationItems,
  listHumanValidationItemsByEnterpriseId
} from '../services/onboarding-service.js';

export function getOnboarding(_request, response) {
  const onboarding = listEnterpriseOnboarding();

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    count: onboarding.length,
    summary: getOnboardingOverview().summary,
    onboarding
  });
}

export function getOnboardingById(request, response) {
  const record = getEnterpriseOnboardingById(request.params.id);

  if (!record) {
    return response.status(404).json({
      error: 'Enterprise onboarding record not found',
      id: request.params.id
    });
  }

  return response.status(200).json(record);
}

export function getOnboardingPipeline(request, response) {
  const pipeline = getAssimilationPipelineByOnboardingId(request.params.id);

  if (!pipeline) {
    return response.status(404).json({
      error: 'Assimilation pipeline not found',
      id: request.params.id
    });
  }

  return response.status(200).json(pipeline);
}

export function getDigitalMirrors(_request, response) {
  const mirrors = listDigitalMirrors();

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    count: mirrors.length,
    digitalMirrors: mirrors
  });
}

export function getDigitalMirror(request, response) {
  const mirror = getDigitalMirrorById(request.params.id);

  if (!mirror) {
    return response.status(404).json({
      error: 'Digital Mirror not found',
      id: request.params.id
    });
  }

  return response.status(200).json(mirror);
}

export function getDtaCandidates(_request, response) {
  const candidates = listDtaCandidates();

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    count: candidates.length,
    dtaCandidates: candidates
  });
}

export function getDtaCandidate(request, response) {
  const candidate = getDtaCandidateById(request.params.id);

  if (!candidate) {
    return response.status(404).json({
      error: 'DTA candidate not found',
      id: request.params.id
    });
  }

  return response.status(200).json(candidate);
}

export function getDataFeedRequirements(_request, response) {
  const requirements = listDataFeedRequirements();

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    count: requirements.length,
    dataFeedRequirements: requirements
  });
}

export function getDataFeedRequirementsForEnterprise(request, response) {
  const requirements = listDataFeedRequirementsByEnterpriseId(request.params.enterpriseId);

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    enterpriseId: request.params.enterpriseId,
    count: requirements.length,
    dataFeedRequirements: requirements
  });
}

export function getHumanValidation(_request, response) {
  const validationItems = listHumanValidationItems();

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    count: validationItems.length,
    humanValidationItems: validationItems
  });
}

export function getHumanValidationForEnterprise(request, response) {
  const validationItems = listHumanValidationItemsByEnterpriseId(request.params.enterpriseId);

  response.status(200).json({
    capability: 'EOS-CAP-0032',
    enterpriseId: request.params.enterpriseId,
    count: validationItems.length,
    humanValidationItems: validationItems
  });
}

export function getOnboardingAssimilationOverview(_request, response) {
  response.status(200).json(getOnboardingOverview());
}
