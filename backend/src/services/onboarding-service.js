import {
  assimilationPipelines,
  dataFeedRequirements,
  digitalMirrors,
  dtaCandidates,
  enterpriseOnboarding,
  humanValidationItems
} from '../data/onboarding.js';
import { findRecordById, listRecords } from './storage-service.js';

export function listEnterpriseOnboarding() {
  return listRecords('enterprise-onboarding', enterpriseOnboarding);
}

export function getEnterpriseOnboardingById(id) {
  return findRecordById('enterprise-onboarding', id, enterpriseOnboarding);
}

export function listAssimilationPipelines() {
  return listRecords('assimilation-pipelines', assimilationPipelines);
}

export function getAssimilationPipelineByOnboardingId(id) {
  const requestedId = String(id).toLowerCase();

  return (
    listAssimilationPipelines().find(
      (pipeline) =>
        String(pipeline.id).toLowerCase() === requestedId ||
        String(pipeline.enterpriseId).toLowerCase() === requestedId
    ) ?? null
  );
}

export function listDigitalMirrors() {
  return listRecords('digital-mirrors', digitalMirrors);
}

export function getDigitalMirrorById(id) {
  return findRecordById('digital-mirrors', id, digitalMirrors);
}

export function listDtaCandidates() {
  return listRecords('dta-candidates', dtaCandidates);
}

export function getDtaCandidateById(id) {
  return findRecordById('dta-candidates', id, dtaCandidates);
}

export function listDataFeedRequirements() {
  return listRecords('data-feed-requirements', dataFeedRequirements);
}

export function listDataFeedRequirementsByEnterpriseId(enterpriseId) {
  const requestedId = String(enterpriseId).toLowerCase();

  return listDataFeedRequirements().filter(
    (requirement) =>
      String(requirement.enterpriseId).toLowerCase() === requestedId ||
      String(requirement.targetDta).toLowerCase() === requestedId ||
      String(requirement.targetObject).toLowerCase() === requestedId
  );
}

export function listHumanValidationItems() {
  return listRecords('human-validation-items', humanValidationItems);
}

export function listHumanValidationItemsByEnterpriseId(enterpriseId) {
  const requestedId = String(enterpriseId).toLowerCase();

  return listHumanValidationItems().filter((item) => String(item.enterpriseId).toLowerCase() === requestedId);
}

export function getOnboardingOverview() {
  const onboarding = listEnterpriseOnboarding();
  const candidates = listDtaCandidates();
  const validationItems = listHumanValidationItems();
  const feedRequirements = listDataFeedRequirements();

  return {
    capability: 'EOS-CAP-0032',
    summary: {
      onboardingRecords: onboarding.length,
      digitalMirrors: listDigitalMirrors().length,
      dtaCandidates: candidates.length,
      dataFeedRequirements: feedRequirements.length,
      humanValidationItems: validationItems.length,
      humanValidationRequired: onboarding.filter((record) => record.humanValidationRequired).length,
      missingDataItems: candidates.reduce((count, candidate) => count + (candidate.missingData?.length ?? 0), 0)
    },
    onboarding,
    pipelines: listAssimilationPipelines(),
    digitalMirrors: listDigitalMirrors(),
    dtaCandidates: candidates,
    dataFeedRequirements: feedRequirements,
    humanValidationItems: validationItems
  };
}
