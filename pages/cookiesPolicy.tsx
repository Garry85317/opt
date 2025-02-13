import React from 'react';
import { AppShell, Text, Table, Divider, rem } from '@mantine/core';
import { usePolicyStyles } from '../hooks/usePolicyStyles';
import { OptomaImage } from '../components/base/Image';

export default function CookiePolicy() {
  const { classes } = usePolicyStyles();
  const tick = <span className={classes.tick}>✔</span>;
  const cross = <span className={classes.cross}>✘</span>;

  return (
    <AppShell className={classes.shell}>
      <OptomaImage className={classes.logo} />
      <Text className={classes.title}>Cookie Policy</Text>
      <p className={classes.date}>Last Update: 15th April, 2024</p>
      <p>
        Cookies are small text files which are stored on your computer by websites that you visit.
        They are widely used to make websites work, or work more efficiently, as well as to provide
        information about how you use the Optoma the website.
      </p>
      <p>
        The following Cookies are associated with using Optoma Account Management (“
        <strong>My Account</strong>”), Optoma Management Suite (“
        <strong>OMS</strong>”) and Optoma Solution Suite (“<strong>OSS</strong>”):
      </p>
      <div className={classes.table}>
        <Table
          striped
          withBorder
          withColumnBorders
          highlightOnHover
          horizontalSpacing="md"
          verticalSpacing="md"
        >
          <thead>
            <tr>
              <th>
                <strong>Cookie</strong>
              </th>
              <th>
                <strong>Name(s)</strong>
              </th>
              <th>
                <strong>My Account</strong>
              </th>
              <th>
                <strong>OMS</strong>
              </th>
              <th>
                <strong>OSS</strong>
              </th>
              <th>
                <strong>Purpose</strong>
              </th>
              <th>
                <strong>Type of cookie</strong>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Cookie preference</td>
              <td>oms.cookie_preference</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{cross}</td>
              <td>
                This cookie is used to remember your cookie preference choice on the OMS website.
              </td>
              <td>Necessary cookie</td>
            </tr>
            <tr>
              <td>Session cookie</td>
              <td>ASP.NET_SessionId</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{cross}</td>
              <td>
                This cookie ensures the website uniquely identifies your browser, ensuring that the
                website correctly operates and communicates with your web browser.
              </td>
              <td>Necessary cookie</td>
            </tr>
            <tr>
              <td>Verification token</td>
              <td>__RequestVerificationToken</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{tick}</td>
              <td>
                This cookie is unique for each page you navigate on the site, and ensures that a
                secure, direct connection exists between us and your browser when you interact with
                our site.
              </td>
              <td>Necessary cookie</td>
            </tr>
            <tr>
              <td>Google Analytics cookies</td>
              <td>_ga, _gid, _gcl, _gat</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{tick}</td>
              <td>
                These cookies are used to collect information about how visitors use our website. We
                use the information to compile reports and to help us improve the website. These
                cookies collect information in a way that does not directly identify anyone,
                including the number of visitors to the website and blog, where visitors have come
                to the website from and the pages they visited.
                <p>
                  <a href="https://support.google.com/analytics/answer/6004245">
                    Read Google&apos;s overview of privacy and safeguarding data
                  </a>
                </p>
              </td>
              <td>Analytics cookie</td>
            </tr>
            <tr>
              <td>YouTube cookies</td>
              <td>CONSENT, PREF, SOCS, YSC, _Secure_YEC, GPS</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{cross}</td>
              <td>
                We embed videos from our official YouTube channel using YouTube&apos;s
                privacy-enhanced mode. This mode may set cookies on your computer once you click on
                the YouTube video player, but YouTube will not store personally-identifiable cookie
                information for playbacks of embedded videos using the privacy-enhanced mode.
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.google.com/support/youtube/bin/answer.py?hl=en-GB&answer=171780"
                  >
                    Read more at YouTube&apos;s embedding videos information page
                  </a>
                </p>
              </td>
              <td>Analytics cookie / Functionality cookie</td>
            </tr>
            <tr>
              <td>Functional cookies</td>
              <td>__cf_bm .fonts.net</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{cross}</td>
              <td>Cookie to track font licensing of MyFonts based on site impressions.</td>
              <td>Necessary cookie</td>
            </tr>
            <tr>
              <td>Zonka Cookies</td>
              <td>zfm_cnt_ck_id zfm_usr_sess_ck_id Dynamic Cookies</td>
              <td>{cross}</td>
              <td>{tick}</td>
              <td>{cross}</td>
              <td>
                We use cookies to collect NPS feedback and user data. This helps us improve our
                product and user experience. Your data is stored securely and not shared with third
                parties without permission. You have the right to view, modify, or delete your data.
                You can opt-out of cookie tracking; see our privacy policy for details.
                <p>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://developers.zonkafeedback.com/docs/js-web-client/web-storage-and-cookies#usage-of-cookies"
                  >
                    Web Storage and Cookies | Zonka Developer Guide (zonkafeedback.com)
                  </a>
                </p>
              </td>
              <td>Analytics cookie</td>
            </tr>
          </tbody>
        </Table>
      </div>

      <Text className={classes.subTitle}>How do I change my cookie settings?</Text>

      <p>
        You can change your cookie preferences at any time by clicking on the [&apos;Cookie
        preferences&apos; link on the website footer]. You can then select to either allow all
        cookies or only allow necessary cookies. You may need to refresh your page for your settings
        to take effect.
      </p>
      <p>
        Alternatively, most web browsers allow some control of most cookies through the browser
        settings.
      </p>
      <p>
        To find out more about cookies, including how to see what cookies have been set, visit{' '}
        <a target="_blank" rel="noreferrer" href="http://www.aboutcookies.org">
          www.aboutcookies.org
        </a>{' '}
        or{' '}
        <a target="_blank" rel="noreferrer" href="http://www.allaboutcookies.org">
          www.allaboutcookies.org
        </a>
        .
      </p>
      <p>Find out how to manage cookies on popular browsers:</p>
      <ul>
        <li>
          <strong>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&hl=en"
            >
              Google Chrome
            </a>
          </strong>
        </li>
        <li>
          <strong>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy"
            >
              Microsoft Edge
            </a>
          </strong>
        </li>
        <li>
          <strong>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
            >
              Mozilla Firefox
            </a>
          </strong>
        </li>
        <li>
          <strong>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://support.microsoft.com/en-gb/help/17442/windows-internet-explorer-delete-manage-cookies"
            >
              Microsoft Internet Explorer
            </a>
          </strong>
        </li>
        <li>
          <strong>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.opera.com/help/tutorials/security/privacy/"
            >
              Opera
            </a>
          </strong>
        </li>
        <li>
          <strong>
            <a target="_blank" rel="noreferrer" href="https://support.apple.com/en-gb/safari">
              Apple Safari
            </a>
          </strong>
        </li>
      </ul>
      <p>
        To find information relating to other browsers, visit the browser developer&apos;s website.
      </p>
      <p>
        To opt out of being tracked by Google Analytics across all websites, visit{' '}
        <a target="_blank" rel="noreferrer" href="https://tools.google.com/dlpage/gaoptout">
          https://tools.google.com/dlpage/gaoptout
        </a>
        .
      </p>
      <Divider my={rem(30)} />
      <Text className={classes.copyright}>Copyright 2024 Optoma Corporation</Text>
    </AppShell>
  );
}
