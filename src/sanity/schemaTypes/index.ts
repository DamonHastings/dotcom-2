import { type SchemaTypeDefinition } from 'sanity';
import siteInfo from '../schema/siteInfo';
import project from '../schema/project';
import landingPage from '../schema/landingPage';
import experience from '../schema/experience';
import cta from '../schema/cta';
import learnMore from '../schema/learnMore';
import heroSection from '../schema/sectionHero';
import richTextSection from '../schema/sectionRichText';
import twoColumnSection from '../schema/sectionTwoColumn';
import flexiblePage from '../schema/flexiblePage';
import featureFlag from '../schema/featureFlag';

export const schema: { types: SchemaTypeDefinition[] } = {
  // Static imports avoid module resolution issues & keep tree-shaking predictable.
  types: [
    siteInfo,
    project,
    landingPage,
    experience,
    cta,
    learnMore,
    heroSection,
    richTextSection,
    twoColumnSection,
    flexiblePage,
    featureFlag,
  ],
};
