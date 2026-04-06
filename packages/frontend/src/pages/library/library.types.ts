interface i18nLibraryFeature {
  id: string;
  heading: string;
  description: string;
}

interface LibraryFeature extends Omit<i18nLibraryFeature, 'id'> {
  href: string;
}

export type { i18nLibraryFeature, LibraryFeature };
