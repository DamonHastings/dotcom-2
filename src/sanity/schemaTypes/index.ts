import { type SchemaTypeDefinition } from 'sanity';
import siteInfo from '../schema/siteInfo';
import project from '../schema/project';
import landingPage from '../schema/landingPage';
import experience from '../schema/experience';

export const schema: { types: SchemaTypeDefinition[] } = {
  // Static imports avoid module resolution issues & keep tree-shaking predictable.
  types: [siteInfo, project, landingPage, experience],
};
