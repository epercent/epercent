import { enterpriseObjects } from '../data/enterprise-objects.js';

const registry = new Map(
  enterpriseObjects.map((enterpriseObject) => [enterpriseObject.id, enterpriseObject])
);

export function listEnterpriseObjects() {
  return Array.from(registry.values());
}

export function getEnterpriseObjectById(id) {
  return registry.get(id) ?? null;
}
