import { LoadingOverlay } from '@mantine/core';
import { useEffect, Fragment, useMemo, useState } from 'react';

export const Privacy = () => {
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
        <Fragment>
          <img
            className="optomaLogo"
            src="https://omrc2.optoma.com/images/design/optomaLogo@2x.png"
            alt=""
          />
          <div className="privacyPolicy contentWrapper">
            <h2 className="contentHeader">Privacy Policy</h2>
            <p>
              Optoma Corporation respects your privacy and is committed to protecting your personal
              data. This privacy notice outlines the basis on which any personal data we collect
              from you, or that you provide to us, will be processed by us and will also tell you
              about your privacy rights and how the law protects you.
            </p>
            <p>
              We provide products and/or services to both consumers and businesses which include,
              but are not limited to, the supply of visual and audio products. This privacy notice
              relates to our processing of your personal data where you are our customer or are a
              prospective customer (whether as an individual/ consumer or as an authorized
              representative of a business) or are a third party who interacts with us (including by
              utilizing our service platform and visiting our website).
            </p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">1. Who we are</h3>
            <p>
              Optoma Corporation is the data controller and is responsible for your personal data
              (collectively referred to as “Optoma”, “we”, “us” or “our” in this privacy notice).
            </p>
            <p>
              &nbsp;If you have any questions about this privacy notice, including any requests to
              exercise your legal rights, please contact us using the details set out below.
            </p>
            <p>Contact details</p>
            <p>Full name of legal entity: Optoma Corporation</p>
            <p>
              Email address:&nbsp;<a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>
            </p>
            <p>
              Postal address:&nbsp;
              <span style={{ color: '#0a0a0a' }}>
                12F., No.213, Sec. 3, Beixin Rd., Xindian Dist, New Taipei City 231, Taiwan, R.O.C.
              </span>
            </p>
            <p>
              Telephone number:&nbsp;<span style={{ color: '#0a0a0a' }}>886-2-8911-8600</span>
            </p>
            <p>&nbsp;</p>
            <p>Changes to the privacy notice and your duty to inform us of changes</p>
            <p>
              We may change this privacy notice from time to time. Any changes we make to this
              privacy notice in the future will be posted on our service platform, our website and,
              where appropriate, notified to you by email. It is important that the personal data we
              hold about you is accurate and current. Please keep us informed if your personal data
              changes during your relationship with us.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">2. The data we collect about you</h3>
            <p>
              Personal data, or personal information, means any information about an individual from
              which that person can be identified. It does not include data where the identity has
              been removed (anonymous data).
            </p>
            <p>&nbsp;</p>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you
              depending on the nature of products and/or services we are providing and what we are
              contracted to do for you or the business on whose behalf you are acting. We have
              grouped together the types of personal data as follows:
            </p>
            <p>
              <strong>Identity Data</strong> includes first name, last name, username or similar
              identifier and title.
            </p>
            <p>
              <strong>Contact Data</strong> includes billing address, delivery address, email
              address and telephone numbers.
            </p>
            <p>
              <strong>Financial Data</strong> includes bank account and payment card details.
            </p>
            <p>
              <strong>Transaction Data</strong> includes details of products and/or services
              purchased from us.
            </p>
            <p>
              <strong>Technical Data</strong> includes internet protocol (IP) address, your login
              data, browser type and version, time zone setting and location, browser plug-in types
              and versions, operating system and platform and other technology on the devices you
              use to access our service platform and our website.
            </p>
            <p>
              <strong>Usage Data</strong> includes information about how you use our service
              platform, our website and our products and/or services.
            </p>
            <p>
              <strong>Marketing and Communications Data&nbsp;</strong>includes your preferences in
              receiving marketing from us and our third parties and your communication preferences.
            </p>
            <p>&nbsp;</p>
            <p>
              We also collect, use and share Aggregated Data such as statistical or demographic data
              for any purpose. Aggregated Data may be derived from your personal data but is not
              considered personal data in law as this data does not directly or indirectly reveal
              your identity. For example, we may aggregate your Usage Data to calculate the
              percentage of users accessing a specific service platform or website feature. However,
              if we combine or connect Aggregated Data with your personal data so that it can
              directly or indirectly identify you, we treat the combined data as personal data which
              will be used in accordance with this privacy notice.
            </p>
            <p>&nbsp;</p>
            <p>
              We do not collect any Special Categories of Personal Data about you (this includes
              details about your race or ethnicity, religious or philosophical beliefs, sexual
              orientation, political opinions, trade union membership, information about your health
              and genetic and biometric data). Nor do we collect any information about criminal
              convictions and offences.
            </p>
            <p>&nbsp;</p>
            <p>
              The products and/or services which we provide together with our service platform and
              our website are not intended for children and we do not knowingly collect any data
              relating to children. It is possible that we could receive information pertaining to
              children by the fraud or deception of a third party. If we are notified of this, as
              soon as we verify the information, we will, as required by law to do so, immediately
              obtain the appropriate parental consent to use that information or, if we are unable
              to obtain such parental consent, we will delete the information from our servers. If
              you would like to notify us of our receipt of information relating to a child, please
              do so by contacting us.
            </p>
            <p>&nbsp;</p>
            <p>
              Where we need to collect personal data by law, or under the terms of a contract we
              have with you or the business on whose behalf you are acting and you fail to provide
              that data when requested, we may not be able to perform the contract we have or are
              trying to enter into with you or the relevant business (as the case may be). In this
              case, we may have to cancel such products and/or services but we will notify you or
              your business (as appropriate) if this is the case at the time.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">3. How is your personal data collected?</h3>
            <p>We use different methods to collect data from and about you including through:</p>
            <p>
              <strong>Direct interactions.</strong> You may give us your Identity and Contact Data
              by filling in forms on our service platform or our website or by corresponding with us
              by post, phone, email, social media or otherwise. This includes personal data you
              provide when you: make an enquiry about our products and/or services; subscribe to our
              publications; request marketing to be sent to you; or give us some feedback on the
              products and/or services we provide.
            </p>
            <p>
              <strong>Automated technologies or interactions.</strong> As you interact with our
              service platform or our website, we may automatically collect Technical Data about
              your equipment, browsing actions and patterns. We collect this personal data by using
              cookies, server logs and other similar technologies. Please see our cookie policy for
              further details.
            </p>
            <p>
              <strong>Third parties or publicly available sources.</strong> We may receive personal
              data about you from various third parties and public sources. When we obtain
              information about you from third parties or publicly available sources rather than
              from you directly, we will notify you of any relevant information obtained, for
              example, the type of personal data, within a reasonable period.
            </p>
            <p>&nbsp;</p>
            <p>Information collected from you about other people</p>
            <p>
              When you provide personal information to us which does not relate directly to you but
              is personal information of a third party (for example, details of other officers or
              employees where our customer is the business on whose behalf you are acting), you
              confirm that you are authorized to do so and shall ensure that this privacy notice is
              brought to the attention of such individuals at the earliest opportunity so that those
              individuals understand how their personal data will be used by us. We will hold and
              use such personal information in accordance with this privacy notice and data
              protection laws.
            </p>
            <p>&nbsp;</p>
            <p>Third-party links</p>
            <p>
              Our service platform or our website may include links to third-party websites,
              plug-ins and applications. Clicking on those links or enabling those connections may
              allow third parties to collect or share data about you. We do not control these
              third-party websites and are not responsible for their privacy statements. When you
              leave our service platform or our website, we encourage you to read the privacy notice
              of every website you visit.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">4. How we use your personal data</h3>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will
              use your personal data in the following circumstances:
            </p>
            <p>
              Where we need to perform the contract we are about to enter into or have entered into
              with you.
            </p>
            <p>
              Where it is necessary for our legitimate interests (or those of a third party) and
              your interests and fundamental rights do not override those interests.
            </p>
            <p>Where we need to comply with a legal or regulatory obligation.</p>
            <p>&nbsp;</p>
            <p>
              See below to find out more about the types of lawful basis that we will rely on to
              process your personal data.
            </p>
            <p>We do not use your information for automated decision making.</p>
            <p>
              Generally, we do not rely on consent as a legal basis for processing your personal
              data except in those circumstances set out in the table below relating to sending
              direct marketing communications via email or as otherwise set out in this privacy
              notice. You have the right to withdraw consent to marketing at any time by following
              the links on any marketing message sent to you or by contacting us at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>.
            </p>
            <p>&nbsp;</p>
            <p>Purposes for which we will use your personal data</p>
            <p>
              We have set out below, in a table format, a description of all the ways we may use
              your personal data, and which of the legal bases we rely on to do so. We have also
              identified what our legitimate interests are where appropriate.
            </p>
            <p>
              Note that we may process your personal data for more than one lawful ground depending
              on the specific purpose for which we are using your data. Please contact us at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>
              if you need details about the specific legal ground we are relying on to process your
              personal data where more than one ground has been set out in the table below.
            </p>

            <table style={{ borderCollapse: 'collapse', border: 'none' }}>
              <tbody>
                <tr>
                  <td>
                    <p>Purpose/Activity</p>
                  </td>
                  <td>
                    <p>Type of data</p>
                  </td>
                  <td>
                    <p>Lawful basis for processing including basis of legitimate interest</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      To communicate with you in connection with our products and/or services, for
                      example, responding and dealing with your enquiries and requests through our
                      service platform or our website including online forms and enquiry submissions
                    </p>
                  </td>
                  <td>
                    <p>(a) Identity</p>
                    <p>(b) Contact</p>
                  </td>
                  <td>
                    <p>
                      (a) Performance of a contract with you where you are an individual/ consumer,
                      sole trader or a general or limited partnership
                    </p>
                    <p>
                      (b) Necessary for our legitimate interests where you are acting on behalf of a
                      company or a limited liability partnership (LLP) (to enable us to assist you
                      and provide you with the best possible service)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      To deliver products and/or services to you where we have contracted directly
                      with you or to deliver products and/or services to your company/LLP where you
                      are acting on its behalf
                    </p>
                  </td>
                  <td>
                    <p>(a) Identity</p>
                    <p>(b) Contact</p>
                    <p>(c) Financial</p>
                    <p>(d) Transaction</p>
                  </td>
                  <td>
                    <p>
                      (a) Performance of a contract with you where we have contracted directly with
                      you as an individual/ consumer, sole trader or a general or limited
                      partnership
                    </p>
                    <p>
                      (b) Necessary for our legitimate interests where you are acting on behalf of a
                      company or an LLP (to perform the contract and run our business effectively
                      and to enable us to provide the best possible service)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>To manage our relationship which will include:</p>
                    <p>
                      (a) Notifying you about changes to our terms of business or privacy policy
                    </p>
                    <p>
                      (b) Asking you to complete a survey following delivery of our products and/or
                      services
                    </p>
                    <p>
                      (c) Responding to any complaints raised in respect of the products and/or
                      services provided by us
                    </p>
                  </td>
                  <td>
                    <p>(a) Identity</p>
                    <p>(b) Contact</p>
                    <p>(c) Transaction</p>
                  </td>
                  <td>
                    <p>
                      (a) Performance of a contract with you where we have contracted directly with
                      you as an individual/ consumer, sole trader or a general or limited
                      partnership
                    </p>
                    <p>(b) Necessary to comply with a legal or regulatory obligation</p>
                    <p>
                      (c) Necessary for our legitimate interests (to keep our records updated and to
                      evaluate customer feedback for the purposes of developing and growing our
                      business)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      To administer and protect our business, our service platform and our website
                      (including troubleshooting, data analysis, testing, system maintenance,
                      support, reporting and hosting of data)&nbsp;
                    </p>
                  </td>
                  <td>
                    <p>(a) Identity</p>
                    <p>(b) Contact</p>
                    <p>(c) Technical</p>
                  </td>
                  <td>
                    <p>
                      (a) Necessary for our legitimate interests (for running our business,
                      provision of administration and IT services, network security, to prevent
                      fraud and in the context of a business reorganisation or group restructuring
                      exercise)
                    </p>
                    <p>(b) Necessary to comply with a legal or regulatory obligation</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      To use data analytics to improve, our service platform our website, products,
                      services, marketing, customer relationships and experiences
                    </p>
                  </td>
                  <td>
                    <p>(a) Technical</p>
                    <p>(b) Usage</p>
                  </td>
                  <td>
                    <p>
                      Necessary for our legitimate interests (to define types of customers for our
                      products and/or services, to keep our service platform, our website updated
                      and relevant, to develop our business and to inform our marketing strategy)
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>
                      To make suggestions and recommendations to you by email about services that
                      may be of interest to you/your business
                    </p>
                  </td>
                  <td>
                    <p>(a) Identity</p>
                    <p>(b) Contact</p>
                    <p>(c) Transaction</p>
                    <p>(d) Technical</p>
                    <p>(e) Usage</p>
                    <p>(f) Marketing and Communications Data</p>
                  </td>
                  <td>
                    <p>
                      (a) Your consent to the processing where you are an individual/consumer, sole
                      trader or a general or limited partnership.)
                    </p>
                    <p>
                      (b) Necessary for our legitimate interests (to develop our products and
                      services and grow our business) where you are a representative of a company or
                      an LLP which is an existing customer of ours and have not opted out of
                      marketing messages
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              <span style={{ color: 'white' }}>
                We have set out below further information on the meaning of each of the legal bases
                for processing set out in the third column of the table above:
              </span>
            </p>
            <p>
              <strong>
                <em>Legitimate Interest</em>
              </strong>{' '}
              means the interest of our business in conducting and managing our business to enable
              us to provide the best service and the best and most secure experience. We make sure
              we consider and balance any potential impact on you (both positive and negative) and
              your rights before we process your personal data for our legitimate interests. We do
              not use your personal data for activities where our interests are overridden by the
              impact on you (unless we have your consent or are otherwise required or permitted to
              by law). You can obtain further information about how we assess our legitimate
              interests against any potential impact on you in respect of specific activities by
              contacting us at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>
            </p>

            <p>&nbsp;</p>
            <p>
              <strong>
                <em>Performance of Contract</em>
              </strong>{' '}
              means processing your data where it is necessary for the performance of a contract to
              which you are a party or to take steps at your request before entering into such a
              contract.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>
                <em>Comply with a legal or regulatory obligation</em>
              </strong>
              means processing your personal data where it is necessary for compliance with a legal
              or regulatory obligation that we are subject to.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>
                <em>Consent&nbsp;</em>
              </strong>
              means processing your personal data where you have provided a freely given, specific,
              informed and unambiguous indication of your agreement to us processing your personal
              data.
            </p>
            <p>&nbsp;</p>
            <p>Marketing</p>
            <p>
              We strive to provide you with choices regarding certain personal data uses,
              particularly around marketing. You will only receive marketing communications from us
              if we have a lawful basis for sending such marketing, details of which can be found in
              the table above.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>Opting out</strong>
            </p>
            <p>
              You can ask us to stop sending you marketing messages at any time by following the
              opt-out links on any marketing message sent to you or by contacting us at any time
              at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>
            </p>

            <p>&nbsp;</p>
            <p>
              <strong>Cookies</strong>
            </p>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when
              websites set or access cookies. If you disable or refuse cookies, please note that
              some parts of our service platform and our website may become inaccessible or not
              function properly. For more information about the cookies we use on our service
              platform and our website, please see&nbsp;the Optoma cookie policy.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>Change of purpose</strong>
            </p>
            <p>
              We will only use your personal data for the purposes for which we collected it, unless
              we reasonably consider that we need to use it for another reason and that reason is
              compatible with the original purpose. If you wish to get an explanation as to how the
              processing for the new purpose is compatible with the original purpose, please contact
              us at&nbsp;<a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>.
            </p>
            <p>&nbsp;</p>
            <p>
              If we need to use your personal data for an unrelated purpose, we will notify you and
              we will explain the legal basis which allows us to do so.
            </p>
            <p>&nbsp;</p>
            <p>
              Please note that we may process your personal data without your knowledge or consent,
              in compliance with the above rules, where this is required or permitted by law.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">5. Disclosures of your personal data</h3>
            <p>
              We may have to share your personal data with selected people or organizations for the
              purposes set out in the table in paragraph 4 above. This will include, but is not
              limited to, sharing personal data with:
            </p>
            <p>
              Other companies in the Optoma Group acting as joint controllers or processors and who
              are based in
              <em>
                Taiwan, United Kingdom, France, Germany, Norway, The Netherlands, Czech Republic and
                Spain
              </em>
              and provide sales and distribution services.
            </p>
            <p>
              Service providers who provide IT and system administration services (including
              back-office support) and marketing platforms.
            </p>
            <p>
              Selected third parties including business partners, independent contractors, advisers,
              accountants and insurers, where there is a legitimate reason for their receiving the
              information.
            </p>
            <p>
              Third parties to whom we may choose to sell, transfer, or merge parts of our business
              or our assets. Alternatively, we may seek to acquire other businesses or merge with
              them. If a change happens to our business, then the new owners may use your personal
              data in the same way as set out in this privacy notice. We may also disclose your
              personal information to third parties if we are under a duty to disclose or share your
              personal data in order to comply with any legal or regulatory obligation, or in order
              to enforce or apply any terms of our arrangement with you or the business on whose
              behalf you are acting.
            </p>
            <p>&nbsp;</p>
            <p>
              We require all third parties to respect the security of your personal data and to
              treat it in accordance with the law. We do not allow our third-party service providers
              to use your personal data for their own purposes and only permit them to process your
              personal data for specified purposes and in accordance with our instructions.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">6. International transfers</h3>
            <p>
              We share your personal data within the Optoma Group. This may involve transferring
              your data outside&nbsp;your&nbsp;country&nbsp;of&nbsp;residence. Whenever we transfer
              your personal data out of&nbsp;your&nbsp;country&nbsp;of&nbsp;residence, we ensure a
              similar degree of protection is afforded to it by implementing certain safeguards.
              Please contact us if you want further information on the specific safeguards used by
              us when transferring your personal data out
              of&nbsp;your&nbsp;country&nbsp;of&nbsp;residence.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">7. Data security</h3>
            <p>
              We have put in place appropriate security measures to prevent your personal data from
              being accidentally lost, used or accessed in an unauthorized way, altered or
              disclosed. In addition, we limit access to your personal data to those employees,
              agents, contractors and other third parties who have a business need to know. They
              will only process your personal data on our instructions and they are subject to a
              duty of confidentiality. Unfortunately, the transmission of information via the
              internet is not completely secure. Although we will do our best to protect your
              personal data, we cannot guarantee the security of your data transmitted to our
              service platform or our website; any transmission is at your own risk. Once we have
              received your information, we will use strict procedures and security features to try
              to prevent unauthorized access.
            </p>
            <p>&nbsp;</p>
            <p>
              Where we have given you (or where you have chosen) a password which enables you to
              access certain parts of our service platform or our website, you are responsible for
              keeping this password confidential. We ask you not to share a password with anyone.
            </p>
            <p>&nbsp;</p>
            <p>
              We have put in place procedures to deal with any suspected personal data breach and
              will notify you and any applicable regulator of a breach where we are legally required
              to do so.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">8. Data retention</h3>
            <p>
              We will only retain your personal data for as long as necessary to fulfil the purposes
              we collected it for, including for the purposes of satisfying any legal, accounting,
              or reporting requirements.
            </p>
            <p>&nbsp;</p>
            <p>
              To determine the appropriate retention period for personal data, we consider the
              amount, nature, and sensitivity of the personal data, the potential risk of harm from
              unauthorized use or disclosure of your personal data, the purposes for which we
              process your personal data and whether we can achieve those purposes through other
              means, and the applicable legal requirements.
            </p>
            <p>&nbsp;</p>
            <p>
              Details of retention periods for different aspects of your personal data are available
              in our retention policy, which is available upon request by contacting us at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>.
            </p>
            <p>&nbsp;</p>
            <p>
              In some circumstances you can ask us to delete your data: see ‘Request erasure’ below
              for further information.
            </p>
            <p>&nbsp;</p>
            <p>
              Furthermore, in some circumstances we may anonymize your personal data (so that it can
              no longer be associated with you) for research or statistical purposes in which case
              we may use this information indefinitely without further notice to you.
            </p>
            <p>&nbsp;</p>
            <p>&nbsp;</p>
            <h3 className="contentSubHeader">9. Your legal rights</h3>
            <p>
              Under certain circumstances, you have rights under data protection laws in relation to
              your personal data. You have the right to:
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>Request access&nbsp;</strong>to your personal data (commonly known as a
              &quot;data subject access request&quot;). This enables you to receive a copy of the
              personal data we hold about you and to check that we are lawfully processing it.
            </p>
            <p>
              <strong>Request correction&nbsp;</strong>of the personal data that we hold about you.
              This enables you to have any incomplete or inaccurate data we hold about you
              corrected, though we may need to verify the accuracy of the new data you provide to
              us.
            </p>
            <p>
              <strong>Request erasure&nbsp;</strong>of your personal data. This enables you to ask
              us to delete or remove personal data where there is no good reason for us continuing
              to process it. You also have the right to ask us to delete or remove your personal
              data where you have successfully exercised your right to object to processing (see
              below), where we may have processed your information unlawfully or where we are
              required to erase your personal data to comply with local law. Note, however, that we
              may not always be able to comply with your request of erasure for specific legal
              reasons which will be notified to you, if applicable, at the time of your request.
            </p>
            <p>
              <strong>Object to processing&nbsp;</strong>of your personal data where we are relying
              on a legitimate interest (or those of a third party) and there is something about your
              particular situation which makes you want to object to processing on this ground as
              you feel it impacts on your fundamental rights and freedoms. In some cases, we may
              demonstrate that we have compelling legitimate grounds to process your information
              which overrides your rights and freedoms.
            </p>
            <p>
              <strong>Request restriction of processing&nbsp;</strong>of your personal data. This
              enables you to ask us to suspend the processing of your personal data in the following
              scenarios: (a) if you want us to establish the data&apos;s accuracy; (b) where our use
              of the data is unlawful but you do not want us to erase it; (c) where you need us to
              hold the data even if we no longer require it as you need it to establish, exercise or
              defend legal claims; or (d) you have objected to our use of your data but we need to
              verify whether we have overriding legitimate grounds to use it.
            </p>
            <p>
              <strong>Request the transfer&nbsp;</strong>of your personal data to you or to a third
              party. We will provide to you, or a third party you have chosen, your personal data in
              a structured, commonly used, machine-readable format. Note that this right only
              applies to automated information which you initially provided consent for us to use or
              where we used the information to perform a contract with you.
            </p>
            <p>
              <strong>Withdraw consent at any time&nbsp;</strong>where we are relying on consent to
              process your personal data. However, this will not affect the lawfulness of any
              processing carried out before you withdraw your consent. If you withdraw your consent,
              we may not be able to provide certain services to you. We will advise you if this is
              the case at the time you withdraw your consent.
            </p>
            <p>
              If you wish to exercise any of the rights set out above, please contact us at&nbsp;
              <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>No fee usually required</strong>
            </p>
            <p>
              You will not have to pay a fee to access your personal data (or to exercise any of the
              other rights). However, we may charge a reasonable fee if your request is clearly
              unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your
              request in these circumstances.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>What we may need from you</strong>
            </p>
            <p>
              We may need to request specific information from you to help us confirm your identity
              and ensure your right to access your personal data (or to exercise any of your other
              rights). This is a security measure to ensure that personal data is not disclosed to
              any person who has no right to receive it. We may also contact you to ask you for
              further information in relation to your request to speed up our response.
            </p>
            <p>&nbsp;</p>
            <p>
              <strong>Time limit to respond</strong>
            </p>
            <p>
              We try to respond to all legitimate requests within one month. Occasionally it may
              take us longer than a month if your request is particularly complex or you have made a
              number of requests. In this case, we will notify you and keep you updated.
            </p>
            <footer />
          </div>
        </Fragment>
        {loadingView}
      </body>
    </html>
  );
};

export default Privacy;
