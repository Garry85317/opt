import { useEffect, useMemo, useState } from 'react';
import { CookiesTable } from './cookiesTable';
import { LoadingOverlay } from '@mantine/core';

export const CookiesPolicy = () => {
  const [defaultLoading, setDefaultLoading] = useState(true);

  useEffect(() => {
    document.body.classList.remove('_white');

    window.setTimeout(() => {
      setDefaultLoading(false);
    }, 1000);
  }, []);

  const loadingView = useMemo(() => {
    return (
      <LoadingOverlay
        radius="sm"
        overlayBlur={2}
        loaderProps={{ size: 'lg', color: 'gray', type: 'bars' }}
        zIndex={0}
        visible={defaultLoading}
      />
    );
  }, [defaultLoading]);

  const cookieData = [
    {
      cookie: 'Cookie preference',
      names: 'optoma_cookie_preference',
      purpose: 'This cookie is used to remember your choice about cookies on the Optoma website.',
      type: 'Necessary cookie',
    },
    {
      cookie: 'Session cookie',
      names: 'ASP.NET_SessionId',
      purpose:
        'This cookie ensures the website uniquely identifies your browser, ensuring that the website correctly operates and communicates with your web browser.',
      type: 'Necessary cookie',
    },
    {
      cookie: 'Verification token',
      names: '__RequestVerificationToken',
      purpose:
        'This cookie is unique for each page you navigate on the site, and ensures that a secure, direct connection exists between us and your browser when you interact with our site.',
      type: 'Necessary cookie',
    },
    {
      cookie: 'Language cookie',
      names: 'ASP.optolanguagechoice',
      purpose:
        'This cookie remembers the language you view the website in, if you change the language from the default.',
      type: 'Necessary cookie',
    },
    {
      cookie: 'Google Analytics cookies',
      names: '_ga, _gid, _gcl, _gat',
      purpose:
        'These cookies are used to collect information about how visitors use our website. We use the information to compile reports and to help us improve the website. The cookies collect information in a way that does not directly identify anyone, including the number of visitors to the website and blog, where visitors have come to the website from and the pages they visited.',
      type: 'Analytics cookie',
      link: {
        url: 'https://support.google.com/analytics/answer/6004245',
        text: "Read Google's overview of privacy and safeguarding data",
      },
    },
    {
      cookie: 'YouTube cookies',
      names: 'CONSENT, PREF, SOCS, YSC, _Secure_YEC, GPS',
      purpose:
        'We embed videos from our official YouTube channel using YouTube’s privacy-enhanced mode. This mode may set cookies on your computer once you click on the YouTube video player, but YouTube will not store personally-identifiable cookie information for playbacks of embedded videos using the privacy-enhanced mode. Read more at',
      type: 'Analytics cookie / Functionality cookie',
      link: {
        url: 'https://www.google.com/support/youtube/bin/answer.py?hl=en-GB&answer=171780',
        text: 'YouTube’s embedding videos information page.',
      },
    },
    {
      cookie: 'Vimeo cookies',
      names: '__cf_bm, player, vuid',
      purpose:
        'We embed videos from our official Vimeo channel. When you press play Vimeo will drop third party cookies to enable the video to play and to collect analytics data such as how long a viewer has watched the video. These cookies do not track individuals.',
      type: 'Functionality cookie',
    },
  ];

  const browserLinks = [
    {
      name: 'Google Chrome',
      url: 'https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&amp;hl=en',
    },
    {
      name: 'Microsoft Edge',
      url: 'https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy',
    },
    {
      name: 'Mozilla Firefox',
      url: 'https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences',
    },
    {
      name: 'Microsoft Internet Explorer',
      url: 'https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies',
    },
    { name: 'Opera', url: 'https://www.opera.com/help/tutorials/security/privacy/' },
    { name: 'Apple Safari', url: 'https://support.apple.com/en-gb/safari' },
  ];

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href={`${process.env.NEXT_PUBLIC_APP_URL}/policy.css`}
        />
      </head>
      <body>
        <div className="contentWrapper">
          <h2 className="contentHeader">OPTOMA COOKIE POLICY</h2>
          <p>
            Cookies are small text files which are stored on your computer by websites that you
            visit. They are widely used to make websites work, or work more efficiently, as well as
            to provide information of how you use the website to us.
            <br /> <br />
            Optoma uses the following cookies:
          </p>
          <CookiesTable rows={cookieData} />
          <h2 className="contentSubHeader">How do I change my cookie settings?</h2>
          <p>
            How do I change my cookie settings? You can change your cookie preferences at any time
            by clicking on the ‘Cookie preferences’ link on the website footer. You can then select
            to either allow all cookies or only allow necessary cookies. You may need to refresh
            your page for your settings to take effect immediately.
          </p>
          <p>
            Alternatively, most web browsers allow some control of most cookies through the browser
            settings.
          </p>
          <p>
            To find out more about cookies, including how to see what cookies have been set, visit
            www.aboutcookies.org or www.allaboutcookies.org.
          </p>
          <p>Find out how to manage cookies on popular browsers:</p>
          <ul>
            {browserLinks.map((link, index) => (
              <li key={index}>
                <a href={link.url} rel="noreferrer" target="_blank">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <p>
            To find information relating to other browsers, visit the browser developer&apos;s
            website.
          </p>
          <p>
            To opt out of being tracked by Google Analytics across all websites, visit{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" rel="noreferrer" target="_blank">
              https://tools.google.com/dlpage/gaoptout
            </a>
          </p>
        </div>
        {loadingView}
      </body>
    </html>
  );
};

export default CookiesPolicy;
