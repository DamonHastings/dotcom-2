import type { StructureResolver } from 'sanity/structure';

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: Learn More page (edit the fixed document ID)
      S.listItem()
        .title('Learn More')
        .child(S.document().schemaType('learnMore').documentId('learnMorePage')),
      // Include the rest of the document types, excluding the explicit singleton type
      ...S.documentTypeListItems().filter((item) => item.getId() !== 'learnMore'),
    ]);
