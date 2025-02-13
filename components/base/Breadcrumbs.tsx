import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Breadcrumbs, BreadcrumbsProps, createStyles, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import toI18nKey from '../../i18n/extraI18nKeys';
import Anchor, { OAMAnchorType } from './Anchor';
import { capitalizeFirstLetter } from '../../utils/text';
import { generatePathParts } from '../../utils/router';

interface OAMBreadcrumbs extends Omit<BreadcrumbsProps, 'children'> {
  start?: number;
  end?: number;
}
type Crumb = { title: string; href: string };

const textColor = 'var(--b-2-b-primary-primary-415284, #415284)';

const useStyles = createStyles(() => ({
  root: {
    height: rem(20),
    marginTop: rem(16),
    marginBottom: rem(20),
    '.mantine-Breadcrumbs-separator': {
      marginLeft: rem(4),
      marginRight: rem(4),
      fontFeatureSettings: 'clig off, liga off',
      fontSize: rem(16),
    },
    '.mantine-Breadcrumbs-separator::nth-last-of-type(2)': {
      color: textColor,
    },
  },
  anchor: {
    fontFeatureSettings: 'clig off, liga off',
    fontSize: rem(16),
  },
  text: {
    color: textColor,
    fontFeatureSettings: 'clig off, liga off',
    fontSize: rem(16),
    fontWeight: 500,
  },
}));

// const getTextGenerator = (param: string, query: ParsedUrlQuery) => null;
const getDefaultTextGenerator = (path: string) => capitalizeFirstLetter(path);

const OAMBreadcrumbs = ({ className, start, end }: OAMBreadcrumbs) => {
  const router = useRouter();
  const { classes, cx } = useStyles();
  // const crumbs = ;
  const { t } = useTranslation();

  const breadcrumbTranslator = useCallback((path: string) => t(toI18nKey(path)!), [t]);

  const breadcrumbs = React.useMemo(() => {
    const asPathNestedRoutes = generatePathParts(router.asPath);
    const pathnameNestedRoutes = generatePathParts(router.pathname);

    const crumblist = asPathNestedRoutes.map((subpath, idx) => {
      // Pull out and convert "[post_id]" into "post_id"
      const param = pathnameNestedRoutes[idx].replace('[', '').replace(']', '');

      const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`;
      return {
        href,
        title: breadcrumbTranslator(subpath),
      };
    });

    // TODO Home route
    return [{ href: '/', title: breadcrumbTranslator('Home') }, ...crumblist];
  }, [router.asPath, router.pathname, router.query, breadcrumbTranslator]);

  function renderCrumbs(item: Crumb, index: number, list: Crumb[]) {
    return list.length - 1 !== index ? (
      <Anchor
        className={classes.anchor}
        href={item.href}
        key={index}
        customType={OAMAnchorType.BLACK}
      >
        {item.title}
      </Anchor>
    ) : (
      <div className={classes.text} key={index}>
        {item.title}
      </div>
    );
  }

  return (
    <>
      {breadcrumbs.length > 1 && (
        <Breadcrumbs separator="/" className={cx(classes.root, className)}>
          {breadcrumbs.slice(start, end).map(renderCrumbs)}
        </Breadcrumbs>
      )}
    </>
  );
};

export default OAMBreadcrumbs;
