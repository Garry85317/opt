import React from 'react';
import { AppShell, Divider, Table, Text, rem } from '@mantine/core';
import { usePolicyStyles } from '../hooks/usePolicyStyles';
import { OptomaImage } from '../components/base/Image';

export default function CCPA() {
  const { classes } = usePolicyStyles();

  return (
    <AppShell className={classes.shell}>
      <OptomaImage className={classes.logo} />
      <Text className={classes.title}>California Consumer Privacy Act Disclosures</Text>
      <p className={classes.date}>Last Update: 15th April, 2024</p>
      <p>
        These disclosures apply only to residents of the State of California (“consumers” or “you”)
        with respect to personal information we process as a business and are intended to supplement
        our{' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="/privacy">
            Privacy Policy
          </a>
        </strong>
        .
      </p>
      <p>
        Any terms defined in the California Consumer Privacy Act of 2018, as amended from time to
        time, including by the California Privacy Rights Act of 2020 and its implementing
        regulations (“<strong>CCPA</strong>”) have the same meaning when used in these disclosures.
        These disclosures do not reflect our collection, use, or disclosure of California
        residents&apos; personal information, or data subject rights, where an exception or
        exemption under the CCPA applies.
      </p>
      <ol>
        <li>
          <Text className={classes.subTitle}>Notice at Collection</Text>

          <p>
            <strong>
              <em>The Category of Personal Information We Collect</em>
            </strong>
          </p>
          <p>
            We may collect non-sensitive personal information and sensitive personal information.
          </p>
          <p>For categories of non-sensitive personal information, we collect:</p>
          <ul>
            <li>
              <strong>Identifiers</strong>, such as real name, alias, online identifier, Internet
              Protocol address, email address, account name;
            </li>
            <li>
              <strong>
                Any information that identifies, relates to, describes, or is capable of being
                associated with, a particular individual
              </strong>
              , such as name, bank account number, credit card number, debit card number, or any
              other financial information, but excluding publicly available information that is
              lawfully made available to the general public from federal, state, or local government
              records;
            </li>
            <li>
              <strong>Commercial information</strong>, such as records of products or services
              purchased, obtained, or considered, or other purchasing or consuming histories or
              tendencies;
            </li>
            <li>
              <strong>Internet or other electronic network activity information</strong>, such as
              browsing history, search history, information regarding a consumer&apos;s interaction
              with a website, or application; and
            </li>
            <li>
              <strong>Geolocation data</strong>, such as your approximate location, IP address, time
              zone.
            </li>
          </ul>
          <p>For categories of sensitive personal information, we collect:</p>
          <ul>
            <li>
              <strong>Account credentials</strong>, such as account log-in, financial account, debit
              card, or credit card number in combination with any required security or access code,
              password, or credentials allowing access to an account; and
            </li>
            <li>
              <strong>Contents of mail, email, and text messages</strong> unless the business is the
              intended recipient of the communication.
            </li>
            <li>
              <strong>Mail, email, or text messages contents not directed us</strong>
            </li>
          </ul>
          <p>
            <strong>
              <em>The Purposes For Which We Collect and Use Personal Information</em>
            </strong>
          </p>
          <p>
            We collect and use non-sensitive and sensitive personal information about California
            residents for the purposes of:
          </p>
          <ul>
            <li>
              Providing, improving, upgrading or enhancing our websites, platforms, portals,
              products and services;
            </li>
            <li>Creating and maintaining your account with us;</li>
            <li>Administering user authentication and account access control;</li>
            <li>
              Providing information relating to the products or services purchased, obtained, or
              considered;
            </li>
            <li>
              Providing relevant marketing such as information about products, services or events
              that may be of interest to you;
            </li>
            <li>Providing customer services support;</li>
            <li>Providing response to your inquiry, comment, concern or complain;</li>
            <li>Processing your request, purchase or subscription;</li>
            <li>
              Maintaining the safety, security, and integrity of our website, platform, portal,
              products and services;
            </li>
            <li>Preventing, detecting, and investigating security incident;</li>
            <li>Performing acts that are required under laws that apply to us; and</li>
            <li>
              Responding to law enforcement requests and as required by applicable law, court order,
              or governmental regulations.
            </li>
          </ul>
          <p>
            We do not sell your personal information and we do not share your personal information
            with third parties for cross-context behavioral advertising.
          </p>
          <p>
            <strong>
              <em>The Criteria Used To Determine Retention Period of Personal Information</em>
            </strong>
          </p>
          <p>
            We generally retain each category of non-sensitive personal and sensitive personal
            information as long as needed or permitted in light of the purpose(s) for which it was
            obtained and any additional time periods necessary for the compliance with laws and our
            legitimate purpose such as the exercise or defense of our legal rights.
          </p>
        </li>
        <li>
          <Text className={classes.subTitle}>CCPA Privacy Policy</Text>

          <p>
            The table below sets out the categories of personal information about California
            residents we have collected and disclosed in the preceding 12 months, the purposes for
            which we have collected, the sources from which the personal information was collected,
            whether have disclosed to third parties, the purposes for which we have disclosed and
            the recipients of disclosures. In the preceding 12 months we did not sell, or share for
            cross context behavioural advertising, the personal information of California residents.
            We do not have actual knowledge that we sell or share the personal information of
            consumers under 16 years of age.
          </p>
          <p>Non-sensitive Personal Information</p>

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
                    <strong>Category of personal information</strong>
                  </th>
                  <th>
                    <strong>Purpose of collection</strong>
                  </th>
                  <th>
                    <strong>Source of collection</strong>
                  </th>
                  <th>
                    <strong>Did we disclose to third parties? If so, for what purpose</strong>
                  </th>
                  <th>
                    <h4>
                      <strong>Recipients of “Disclosure”</strong>
                    </h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Identifiers, such as real name, alias, online identifier, Internet Protocol
                    address, email address, account name
                  </td>
                  <td>
                    See paragraph “The Purposes For Which We Collect and Use Personal Information”
                    under section headed “1. Notice at Collection” above
                  </td>
                  <td>
                    <ul>
                      <li>Data subjects</li>
                      <li>
                        Employers, educational institutions, agents or attorneys of the data
                        subjects disclosing data on behalf of the data subjects
                      </li>
                    </ul>
                  </td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services;
                      </li>
                      <li>Creating and maintaining your account with us;</li>
                      <li>Administering user authentication and account access control;</li>
                      <li>
                        Providing information relating to the products or services purchased,
                        obtained, or considered;
                      </li>
                      <li>
                        Providing relevant marketing such as information about products, services or
                        events that may be of interest to you;
                      </li>
                      <li>Providing customer services support;</li>
                      <li>Providing response to your inquiry, comment, concern or complain;</li>
                      <li>
                        Maintaining the safety, security, and integrity of our website, platform,
                        portal, products and services; and
                      </li>
                      <li>Preventing, detecting, and investigating security incident.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>
                        Optoma and its subsidiaries and affiliates (“<strong>Optoma Group</strong>”)
                      </li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    Any information that identifies, relates to, describes, or is capable of being
                    associated with, a particular individual, such as name, bank account number,
                    credit card number, debit card number, or any other financial information, but
                    excluding publicly available information that is lawfully made available to the
                    general public from federal, state, or local government records
                  </td>
                  <td>See above</td>
                  <td>See above</td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services;
                      </li>
                      <li>Creating and maintaining your account with us;</li>
                      <li>Administering user authentication and account access control;</li>
                      <li>
                        Providing information relating to the products or services purchased,
                        obtained, or considered;
                      </li>
                      <li>
                        Providing relevant marketing such as information about products, services or
                        events that may be of interest to you;
                      </li>
                      <li>Providing customer services support;</li>
                      <li>Providing response to your inquiry, comment, concern or complain;</li>
                      <li>Processing your request, purchase or subscription;</li>
                      <li>
                        Maintaining the safety, security, and integrity of our website, platform,
                        portal, products and services; and
                      </li>
                      <li>Preventing, detecting, and investigating security incident.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Commercial information</strong>, such as records of products or services
                    purchased, obtained, or considered, or other purchasing or consuming histories
                    or tendencies
                  </td>
                  <td>See above</td>
                  <td>See above</td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services;
                      </li>
                      <li>
                        Providing information relating to the products or services purchased,
                        obtained, or considered;
                      </li>
                      <li>
                        Providing relevant marketing such as information about products, services or
                        events that may be of interest to you;
                      </li>
                      <li>Providing customer services support; and</li>
                      <li>Providing response to your inquiry, comment, concern or complain.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Internet or other electronic network activity information</strong>, such
                    as browsing history, search history, information regarding a consumer&apos;s
                    interaction with a website, or application
                  </td>
                  <td>See above</td>
                  <td>Via our Sites</td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services;
                      </li>
                      <li>Providing customer services support;</li>
                      <li>Providing response to your inquiry, comment, concern or complain;</li>
                      <li>
                        Maintaining the safety, security, and integrity of our website, platform,
                        portal, products and services; and
                      </li>
                      <li>Preventing, detecting, and investigating security incident.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Geolocation data</strong>, such as your approximate location, IP
                    address, time zone
                  </td>
                  <td>See above</td>
                  <td>Via our Sites</td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services;
                      </li>
                      <li>Providing customer services support; and</li>
                      <li>Providing response to your inquiry, comment, concern or complain.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <p>Sensitive Personal Information</p>
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
                    <strong>Category of personal information</strong>
                  </th>
                  <th>
                    <strong>Purpose of collection</strong>
                  </th>
                  <th>
                    <strong>Source of collection</strong>
                  </th>
                  <th>
                    <strong>Did we disclose to third parties? If so, for what purpose</strong>
                  </th>
                  <th>
                    <h4>
                      <strong>Recipients of “Disclosure”</strong>
                    </h4>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Account credentials, </strong>such as account log-in, financial account,
                    debit card, or credit card number in combination with any required security or
                    access code, password, or credentials allowing access to an account
                  </td>
                  <td>
                    See paragraph “The Purposes For Which We Collect and Use Personal Information”
                    under section headed “1. Notice at Collection” above
                  </td>
                  <td>
                    <ul>
                      <li>Data subjects</li>
                      <li>
                        Employers, educational institutions, agents or attorneys of the data
                        subjects disclosing data on behalf of the data subjects
                      </li>
                    </ul>
                  </td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>Administering user authentication and service access control; and</li>
                      <li>Preventing, detecting, and investigating security incident.</li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Contents of mail, email, and text messages </strong>unless the business
                    is the intended recipient of the communication
                  </td>
                  <td>See above</td>
                  <td>Via our Sites</td>
                  <td>
                    <p>Yes</p>
                    <p>
                      <strong>Purpose of disclosure:</strong>
                    </p>
                    <ul>
                      <li>
                        Providing, improving, upgrading or enhancing our websites, platforms,
                        portals, products and services.
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul>
                      <li>Optoma Group</li>
                      <li>Service providers</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </li>
        <li>
          <Text className={classes.subTitle}>California Consumer Rights</Text>

          <p>
            <strong>
              <em>Your Rights</em>
            </strong>
          </p>
          <p>Under the CCPA, as a California resident, you have:</p>
          <ul>
            <li>
              <strong>right to know</strong> what personal information we have collected about you,
              including:{' '}
            </li>
            <ul>
              <li>the categories of personal information we have collected about you;</li>
              <li>the categories of sources from which the personal information is collected;</li>
              <li>
                the business or commercial purpose for collecting, selling, or sharing personal
                information;
              </li>
              <li>the categories of third parties to whom we disclose personal information; and</li>
              <li>the specific pieces of personal information we have collected about you. </li>
              <p>You may only exercise your right to know twice in a 12-month period.</p>
            </ul>
            <li>
              <strong>right to delete</strong> any personal information about you which we have
              collected from you, subject to certain exceptions;
            </li>
            <li>
              <strong>right to correct</strong> inaccurate personal information that we maintain
              about you;
            </li>
            <li>
              <strong>right to opt-out</strong> of the sale or sharing of your personal information
              by us. We do not sell your personal information and we do not share your personal
              information with third parties for cross-context behavioral advertising;
            </li>
            <li>
              <strong>right to limit</strong> our use and disclosure of your sensitive personal
              information to purposes specified in subsection 7027(l) of the CCPA. We do not use or
              disclose sensitive personal information for purposes other than those specified in
              subsection 7027(m) of the CCPA; and
            </li>
            <li>
              <strong>right not to be discriminated or retaliated</strong> by us for your exercise
              of privacy rights under the CCPA.
            </li>
          </ul>
          <p>
            <strong>
              <em>How You Can Exercise Your CCPA Rights </em>
            </strong>
          </p>
          <p>
            You may make a request related to your personal information. Alternatively, you may
            authorize another person or a business entity registered with the California Secretary
            of State (collectively, “<strong>Authorized Agent</strong>”) to submit a CCPA request on
            your behalf. You may also authorize a business entity registered with the California
            Secretary of State to submit a request on your behalf.
          </p>
          <p>To make a request, you or your Authorized Agent can:</p>
          <ul>
            <li>Call 510-897-8600 or toll free at 1-888-289-6786; or</li>
            <li>Email privacy@optoma.com; or</li>
            <li>
              Complete the{' '}
              <strong>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.optomausa.com/support/contact-us/58"
                >
                  request form
                </a>
              </strong>
              ; or
            </li>
            <li>
              By post to Optoma Technology Inc., 47697 Westinghouse Dr, Fremont, CA 94539, USA.
            </li>
          </ul>
          <p>
            <strong>
              <em>Timelines for Responding Your Request</em>
            </strong>
          </p>
          <p>
            We will confirm the receipt of your request no later than 10 business days after
            receiving your request to know, correct or delete.
          </p>
          <p>
            While we endeavor to provide substantive response to you no later than 45 calendar days
            of the receipt of your request, there may be a situation where we may take up to an
            additional 45 calendar days to respond to your request, in which case we will provide
            you with notice and an explanation of the reason.
          </p>
          <p>
            <strong>
              <em>How We Will Verify Your Request</em>
            </strong>
          </p>
          <p>
            In response to your request, for example, for requests to know, delete or correct
            personal information, we will need to verify your identity. If you direct your
            Authorized Agent to make a request, we will require more information from either you
            directly or your Authorized Agent to verify that you are the person directing your
            Authorized Agent. For example, Authorized Agent shall provide to us your signed
            permission demonstrating that they have been authorized by you to act on your behalf and
            your direct confirmation with us that you provided your Authorized Agent with permission
            to submit the request. However, if you provide your Authorized Agent with power of
            attorney pursuant to Probate Code sections 4121 to 4130, it may not be necessary to
            perform these steps and we will respond to any request from your Authorized Agent in
            accordance with the CCPA.
          </p>
          <p>
            You, or your authorized agent, must provide sufficient information to enable us to
            reasonably verify that you are the person whose personal information was collected. If
            you do not provide sufficient information for us to reasonably verify your identity, we
            will not be able to fulfil your request. We will only use the personal information you
            provide to us in a request for the purposes of verifying your identity and to fulfil
            your request.
          </p>
          <p>
            We do not charge a fee to process or respond to your verifiable consumer request unless
            it is excessive, repetitive, or manifestly unfounded. If we determine that the request
            warrants a fee, we will tell you why we made that decision and provide you with a cost
            estimate before completing your request.
          </p>
        </li>
        <li>
          <Text className={classes.subTitle}>Contact Us</Text>

          <p>
            To view our full privacy policy, visit our{' '}
            <strong>
              <a target="_blank" rel="noreferrer" href="/privacy">
                Privacy Policy
              </a>
            </strong>{' '}
            and our{' '}
            <strong>
              <a target="_blank" rel="noreferrer" href="/childrenPrivacy">
                Privacy Policy for Children
              </a>
            </strong>
            .
          </p>
          <p>
            If you have any questions or comments about our disclosures, our privacy policy or our
            practices, or you need to access any of them in an alternative format due to having a
            disability:
          </p>
          <ul>
            <li>Call 510-897-8600 or toll free at 1-888-289-6786; or</li>
            <li>Email privacy@optoma.com; or</li>
            <li>
              Complete the{' '}
              <strong>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.optomausa.com/support/contact-us/58"
                >
                  request form
                </a>
              </strong>
              ; or
            </li>
            <li>
              By post to Optoma Technology Inc., 47697 Westinghouse Dr, Fremont, CA 94539, USA.
            </li>
          </ul>
        </li>
      </ol>
      <Divider my={rem(30)} />
      <Text className={classes.copyright}>Copyright 2024 Optoma Corporation</Text>
    </AppShell>
  );
}
