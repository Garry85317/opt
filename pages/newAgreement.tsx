import { createStyles, em, getBreakpointValue, rem, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Button, { OAMButtonType } from '../components/base/Button';
import DialogCloseButton from '../components/base/DialogCloseButton';
import { useUpdateOrganizationLatestInfoMutation } from '../store/services';
import { usePopup } from '../providers/popupProvider';

export enum FontType {
  BOLD,
  HYPERLINK,
  UNDERLINE_AND_BOLD,
}

export interface EmphasizeText {
  splitWord: string;
  content: string;
  type: FontType;
  hyperlink?: string;
}

const useStyles = createStyles((theme) => ({
  ag_container: {
    backgroundColor: '#F2F2F2',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  ag_body: {
    backgroundColor: '#FFFFFF',
    maxWidth: rem(924),
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    marginTop: rem(100),
    marginBottom: rem(100),
    borderRadius: rem(6),
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.16)',
    fontSize: rem(14),
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.md))})`]: {
      marginLeft: rem(50),
      marginRight: rem(50),
    },
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.sm))})`]: {
      maxWidth: rem(708),
      marginLeft: rem(30),
      marginRight: rem(30),
    },
    [`@media (max-width: ${em(getBreakpointValue(theme.breakpoints.xs))})`]: {
      maxWidth: rem(300),
      marginLeft: rem(10),
      marginRight: rem(10),
    },
  },
  ag_inner_body: {
    padding: `${rem(10)} ${rem(20)} ${rem(20)} ${rem(20)}`,
  },
  ag_title_container: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  ag_title: {
    marginTop: rem(20),
  },
  ag_agreementContent2: {
    marginBottom: rem(0),
  },
  ag_list_container: {
    paddingInlineStart: rem(20),
    marginTop: rem(0),
  },
  ag_button_container: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginBottom: rem(20),
  },
}));

function NewAgreement() {
  const router = useRouter();
  const redirectTo = router.query.redirectTo;
  const { classes } = useStyles();
  const { t } = useTranslation();
  const theme = useMantineTheme();
  const buttonStyles = useCallback(
    () => ({
      root: {
        maxWidth: rem(150),
        paddingLeft: rem(20),
        paddingRight: rem(20),
      },
    }),
    [],
  );

  const title = t('NoticeOfChange');
  const dateString = `[${process.env.NEXT_PUBLIC_NEW_AGREEMENT_EFFECTIVE_DATE}]`;
  const effectiveDate = `${t('EffectiveDate')}: ${dateString}`;
  const [updateOrganizationLatestInfo, updateOrganizationLatestInfoStatus] =
    useUpdateOrganizationLatestInfoMutation();
  const { message } = usePopup();

  const renderHighlightElement = (highlightText: EmphasizeText, someKey: string) => {
    let jsxElement: JSX.Element | boolean = false;

    switch (highlightText.type) {
      case FontType.BOLD:
        jsxElement = <strong key={someKey}>{highlightText.content}</strong>;
        break;
      case FontType.HYPERLINK:
        jsxElement = (
          <a key={someKey} rel="noreferrer" href={highlightText.hyperlink} target="_blank">
            {highlightText.content}
          </a>
        );
        break;
      case FontType.UNDERLINE_AND_BOLD:
        jsxElement = (
          <strong key={someKey}>
            <u>{highlightText.content}</u>
          </strong>
        );
        break;
    }
    return jsxElement;
  };

  function getContentJSX(i18n: string, texts: Array<EmphasizeText>): JSX.Element {
    if (!i18n || texts.length === 0) {
      return <></>;
    }

    const highlightTextMap = texts.reduce((acc, highlightText) => {
      acc[highlightText.splitWord] = highlightText;
      return acc;
    }, {} as Record<string, EmphasizeText>);

    const splitRegExp = new RegExp('({[A-Za-z0-9_]+})', 'g');
    const splitArray = i18n.split(splitRegExp);

    return (
      <>
        {splitArray.map((part, i) => {
          const highlightText =
            part.startsWith('{') && part.endsWith('}') && highlightTextMap[part.slice(1, -1)];
          if (highlightText) {
            return renderHighlightElement(highlightText, `highlight${highlightText.type}${i}`);
          }
          return !!part && <span key={`part${i}`}>{part}</span>;
        })}
      </>
    );
  }

  function redirectEvent() {
    try {
      const urlString = redirectTo as string;

      if (!urlString) {
        router.push({ pathname: '/' });
      }

      if (urlString.startsWith('/')) {
        router.replace({ pathname: urlString, query: router.query });
      } else {
        const url = new URL(urlString);
        //Solution redirect after login, remark by Howard
        router.push(url.href);
      }
    } catch (ex) {
      router.push({ pathname: '/' });
    }
  }

  async function acceptEvent() {
    await updateOrganizationLatestInfo({ hasAgreedToTerms: true })
      .unwrap()
      .then((res: any) => {
        try {
          const result = JSON.parse(res);
          if (result.data.message === 'success') {
            redirectEvent();
          } else {
            message.open({
              tit: t('Error'),
              msg: 'Unknown_error',
              rightBtn: t('Close'),
            });
          }
        } catch (ex) {
          message.open({
            tit: t('Error'),
            msg: 'Unknown_error',
            rightBtn: t('Close'),
          });
        }
      });
  }

  const agreementContent1 = getContentJSX(t('AgreementContent1'), [
    {
      splitWord: 'OMS',
      content: t('OMS'),
      type: FontType.BOLD,
    },
    {
      splitWord: 'WB',
      content: t('WB'),
      type: FontType.BOLD,
    },
  ]);

  const agreementContent2 = t('AgreementContent2').replace('{EffectiveDate}', dateString);

  const agreementContent3 = getContentJSX(t('AgreementContent3'), [
    {
      splitWord: 'OSS',
      content: t('OSS'),
      type: FontType.BOLD,
    },
  ]);

  const agreementContent4 = getContentJSX(t('AgreementContent4'), [
    {
      splitWord: 'My_account',
      content: t('My_account'),
      type: FontType.BOLD,
    },
  ]);

  const agreementContent5 = getContentJSX(t('AgreementContent5'), [
    {
      splitWord: 'Old_agree_terms',
      content: t('Agree_terms'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_OMS_OLD_TERMS_AND_CONDITIONS_URL,
    },
    {
      splitWord: 'Old_agree_privacy_policy',
      content: t('Agree_privacy_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_OMS_OLD_PRIVACY_POLICY_URL,
    },
    {
      splitWord: 'Old_agree_cookie_policy',
      content: t('Agree_cookie_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_OMS_OLD_COOKIES_POLICY_URL,
    },
    {
      splitWord: 'Agree_terms',
      content: t('Agree_terms'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL,
    },
    {
      splitWord: 'Agree_privacy_policy',
      content: t('Agree_privacy_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL,
    },
    {
      splitWord: 'Agree_cookie_policy',
      content: t('Agree_cookie_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_COOKIES_POLICY_URL,
    },
  ]);

  const agreementContent6 = getContentJSX(t('AgreementContent6'), [
    {
      splitWord: 'Old_agree_terms',
      content: t('Agree_terms'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_WB_OLD_TERMS_AND_CONDITIONS_URL,
    },
    {
      splitWord: 'Old_agree_privacy_policy',
      content: t('Agree_privacy_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_WB_OLD_PRIVACY_POLICY_URL,
    },
    {
      splitWord: 'Old_agree_cookie_policy',
      content: t('Agree_cookie_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_WB_OLD_COOKIES_POLICY_URL,
    },
    {
      splitWord: 'Agree_terms',
      content: t('Agree_terms'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL,
    },
    {
      splitWord: 'Agree_privacy_policy',
      content: t('Agree_privacy_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL,
    },
    {
      splitWord: 'Agree_cookie_policy',
      content: t('Agree_cookie_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_COOKIES_POLICY_URL,
    },
  ]);

  const agreementContent9 = getContentJSX(t('AgreementContent9'), [
    {
      splitWord: 'AgreementContent7',
      content: t('AgreementContent7'),
      type: FontType.BOLD,
    },
    {
      splitWord: 'AgreementContent8',
      content: t('AgreementContent8'),
      type: FontType.UNDERLINE_AND_BOLD,
    },
  ]);

  const agreementContent10 = getContentJSX(t('AgreementContent10'), [
    {
      splitWord: 'Agree_terms',
      content: t('Agree_terms'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_TERMS_AND_CONDITIONS_URL,
    },
    {
      splitWord: 'Agree_privacy_policy',
      content: t('Agree_privacy_policy'),
      type: FontType.HYPERLINK,
      hyperlink: process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL,
    },
  ]);

  const agreementContent11 = t('AgreementContent11');

  return (
    <div className={classes.ag_container}>
      <div className={classes.ag_body}>
        <div className={classes.ag_inner_body}>
          <div className={classes.ag_title_container}>
            <strong className={classes.ag_title}>{title}</strong>
            <DialogCloseButton clickEvent={redirectEvent} />
          </div>
          <br />
          <p>{effectiveDate}</p>
          <br />
          {agreementContent1}
          <br />
          <p className={classes.ag_agreementContent2}>{agreementContent2}</p>
          <ul className={classes.ag_list_container}>
            <li>{agreementContent3}</li>
            <li>{agreementContent4}</li>
            <li>{agreementContent5}</li>
            <li>{agreementContent6}</li>
          </ul>
          <br />
          {agreementContent9}
          <br />
          <br />
          {agreementContent10}
          <br />
          <p>{agreementContent11}</p>
        </div>
        <div className={classes.ag_button_container}>
          <Button customType={OAMButtonType.DARK} onClick={acceptEvent} styles={buttonStyles}>
            {t('Accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewAgreement;

NewAgreement.requireAuth = true;
