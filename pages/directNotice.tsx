import React from 'react';
import { AppShell, Divider, Text, rem } from '@mantine/core';
import { usePolicyStyles } from '../hooks/usePolicyStyles';
import { OptomaImage } from '../components/base/Image';

export default function DirectNotice() {
  const { classes } = usePolicyStyles();

  return (
    <AppShell className={classes.shell}>
      <OptomaImage className={classes.logo} />
      <Text className={classes.title}>Direct Notice to Educational Institutions</Text>
      <p className={classes.date}>Last Update: 15th April, 2024</p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>Who We Are</span>
        </em>
      </Text>
      <p>
        This notice is provided to an educational institution (“<strong>you</strong>” or “
        <strong>your</strong>”) by Optoma Holding Limited (“<strong>Optoma</strong>”, and together
        with its subsidiaries and affiliates, “<strong>Optoma Group</strong>” or “
        <strong>we</strong>” or “<strong>our</strong>” or “<strong>us</strong>”).
      </p>
      <p>
        Optoma is a company incorporated and registered in England and Wales. Its immediate
        subsidiaries include Optoma Europe Ltd (a company incorporated and registered in England and
        Wales), Optoma Corporation (a company incorporated in Taiwan, Republic of China), Optoma
        Technology Inc. (a company incorporated in California (United States)) and Optoma China Co.,
        Limited (a limited liability company incorporated in the People&apos;s Republic of China).
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>Purpose Of This Notice</span>
        </em>
      </Text>
      <p>
        As you have accessed to our websites, platforms, portals, products and services
        (collectively, “<strong>Sites</strong>”) and desires to register an account for your
        students, we are under the responsibility to comply with laws and regulations.
      </p>
      <p>
        For example, under the United States&apos; Children&apos;s Online Privacy Protection Act (“
        <strong>COPPA</strong>”), an operator such as Optoma Group must provide parental
        notification and obtain verifiable parental consent before collecting personal information
        from children under the age of 13, except in limited situations (for exceptions to this
        consent requirement, please see{' '}
        <a target="_blank" rel="noreferrer" href="https://www.law.cornell.edu/cfr/text/16/312.5">
          16 CFR § 312.5(c)
        </a>
        ). Where an educational institution has contracted with an operator such as Optoma Group to
        collect personal information from students for the use and benefit of the educational
        institution, and for no other commercial purpose, the operator such as Optoma Group is not
        required to obtain consent directly from parents under COPPA, and COPPA allows for such
        educational institution to act as a parent&apos;s agent and to consent under COPPA to the
        collection of a student&apos;s information on their parent&apos;s behalf. It is understood
        that educational institution&apos;s ability to consent is limited to the educational
        context. The operator such as Optoma Group can presume that the educational
        institution&apos;s authorisation for the collection of students&apos; personal information
        is based upon the educational institution having obtained their parents&apos; consent. In
        order for the operator to rely on consent obtained from the educational institution under
        COPPA instead of the parent, we must provide the educational institution with the same type
        of direct notice regarding our practices as to the collection, use, or disclosure of
        personal information from children as it would otherwise provide to the parent. As such, we
        provide you with this notice which tells you:
      </p>
      <ul>
        <li>
          that we rely on your consent under COPPA to the collection of your students&apos;
          information on their parents&apos; behalf and you need to collect contact information for
          the purpose of directly obtaining verifiable parental consent;
        </li>
        <li>
          that we want to collect personal information from your students on Optoma Group&apos;s
          Sites;
        </li>
        <li>
          that your consent and authorisation is required for our collection, use, and disclosure of
          your students&apos; personal information;
        </li>
        <li>
          the specific personal information we want to collect and how it might be disclosed to
          others;
        </li>
        <li>a link to our online terms and conditions and privacy policy;</li>
        <li>how you can get and give consent; and</li>
        <li>
          that if you do not consent and authorise our collection, use and disclosure of your
          students&apos; personal information, we will not collect, use and disclose such
          information.
        </li>
      </ul>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            Reliance on Educational Institutions&apos; Consent and Authorisation
          </span>
        </em>{' '}
      </Text>
      <p>
        Generally, we do not permit anyone under the age of 18 to use our Sites. However, our Sites
        may be used in school environment, you may invite and authorise your students to use our
        Sites, and create accounts for them. Where you have contracted with us to collect personal
        information from your students (“<strong>Authorised Students</strong>”) for your use and
        benefit, and for no other commercial purpose, Authorised Students who are under the age of
        18 can use our Sites under your and your teachers&apos; monitoring, supervision and
        management.
      </p>
      <p>
        As we rely on your consent under COPPA to the collection of the Authorised Students&apos;
        information on the parent&apos;s behalf, you need to collect their parents&apos; contact
        information for the purpose of obtaining verifiable parental consent, and obtain the consent
        directly from the parents. Once you provide us with consent and authorisation, we will
        presume that your consent and authorisation to the collection of the Authorised
        Students&apos; personal information is based upon that you having obtained the parents&apos;
        consent.
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            How and What We Collect From Your Students
          </span>
        </em>
      </Text>
      <p>
        <em>
          <span style={{ textDecoration: 'underline' }}>Information We Collect Directly </span>
        </em>
      </p>
      <p>
        The Authorised Students can access many parts of our Sites and use many of its features
        without providing us with personal information. However, some content and features are
        available only to registered users. As such, you or a party acting on your behalf may
        register an account for the Authorised Students. As part of the account registration
        process, you or a party acting on your behalf is required to provide us directly the
        following personal information of your students:
      </p>
      <ul>
        <li>username;</li>
        <li>email;</li>
        <li>password;</li>
        <li>school name;</li>
        <li>language;</li>
        <li>school location; and</li>
        <li>occupation.</li>
      </ul>
      <p>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            Information Your Educational Institution or You Create and Save in the Cloud
          </span>
        </em>
      </p>
      <p>
        You, your employees, a party acting on your behalf and/or Authorised Students may provide to
        us data through our Sites or create data through the use of our Sites (collectively, the “
        <strong>Customer Data</strong>”). For example, when you use our WhiteBoard, you may choose
        to save a particular session in the cloud. You, your employees, a party acting on your
        behalf and/or Authorised Students determine and control what will be included in the
        Customer Data, and whether or not the Customer Data is stored in the cloud provided.
      </p>
      <p>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            Users Make Personal Information Publicly Available{' '}
          </span>
        </em>
      </p>
      <p>
        We enable users to interact, collaborate or communicate with others on or through our Sites.
        The nature of these features allows users to write, input, submit, share, upload or store in
        our Sites any content or any record directly related to the Authorised Students which may
        contain personally identifiable information and is maintained by you, your teachers or any
        party acting on your behalf. We do not monitor or review this content or record before and
        after it is written, inputted, submitted, shared, uploaded or store in our Sites, and we do
        not control the actions of any user or any parties with whom such user interacts,
        collaborates or communicates. You, your teachers and any party acting on your behalf shall
        educate the Authorised Students about safety online and to carefully monitor, supervise and
        manager their use of social features to ensure they do not disclose their personal
        information on or through our Sites.
      </p>
      <p>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            Automatic Information Collection and Tracking
          </span>
        </em>
      </p>
      <p>
        We use certain technologies, such as cookies, to automatically collect information from our
        users (including your students) when they visit, use, access or navigate through our Sites
        and use certain features. The information we collect through these technologies may include:
      </p>
      <ul>
        <li>
          Your Internet Protocol (IP) address, which is the number automatically assigned to your
          computer whenever you access the Internet and that can sometimes be used to derive your
          general geographic area.
        </li>
      </ul>
      <p>
        We may combine non-personal information we collect through these technologies with personal
        information about you or the Authorised Students that we collect.
      </p>
      <p>
        We also use Google Analytics which collect your device&apos;s location, internet log
        information and general visitor behavior information in an anonymous way. This information
        is then used to analyse and evaluate the use of our Sites and to compile statistical reports
        on user activity. You can find more{' '}
        <strong>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://policies.google.com/technologies/partner-sites"
          >
            information
          </a>
        </strong>{' '}
        about how data is collected and processed in connection with the Google Analytics service.
        You can also read{' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="https://policies.google.com/privacy?hl=en-US">
            Google&apos;s privacy policy
          </a>
        </strong>
        .
      </p>
      <p>
        We only collect as much information about your students as is reasonably necessary for your
        students to participate in an activity, and we do not condition his or her participation on
        the disclosure of more personal information than is reasonably necessary.
      </p>
      <p>
        Upon your request, we will provide you with a description of the types of personal
        information collected, an opportunity to review the students&apos; personal information and
        the right to have the information deleted, and the opportunity to prevent further use or
        online collection of your student&apos;s personal information.
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            How We Might Use Or Disclose To Others
          </span>
        </em>
      </Text>
      <p>
        We do not share, sell, rent, or transfer their personal information other than as described
        in this section. We do not send any advertising or marketing information to the Authorised
        Students and their parents.
      </p>
      <p>
        We collect, use and disclose your students&apos; personal information for your authorised
        educational purpose. Specifically, information we collect is used for the following
        purposes:
      </p>
      <ul>
        <li>to operate our Sites;</li>
        <li>to provide you with our products and/or services;</li>
        <li>
          to enable you, your teachers, any party acting on your behalf and their Authorised
          Students to login to, and use, our Sites;
        </li>
        <li>
          to allow you, your teachers, any party acting on your behalf to monitor, supervise, manage
          and engage with our Sites;
        </li>
        <li>
          to enable class related activities such as classroom content, assignments/tasks,
          interactions, collaborations and communications; and
        </li>
        <li>to respond to the enquires from you or the parents of the Authorised Students.</li>
      </ul>
      <p>
        However, we may use or disclose aggregated information (such information does not identify
        any individual) about our users for the following purposes:
      </p>
      <ul>
        <li>to improve the Sites;</li>
        <li>for marketing purposes related to our Sites;</li>
        <li>for research and statistical purposes; or</li>
        <li>for customer support purposes.</li>
      </ul>
      <p>In addition, we may disclose our user&apos;s personal information:</p>
      <ul>
        <li>
          If we are required to do so by law or legal process, such as to comply with any court
          order or subpoena or to respond to any government or regulatory request.
        </li>
        <li>
          If we believe disclosure is necessary or appropriate to protect the rights, property, or
          safety of Optoma Group, our customers or others, including to:{' '}
        </li>
        <ul>
          <li>protect the safety of a child;</li>
          <li>protect the safety and security of our Site; or</li>
          <li>enable us to take precautions against liability.</li>
        </ul>

        <li>To law enforcement agencies or for an investigation related to public safety.</li>
      </ul>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            Terms and Conditions and Privacy Policy
          </span>
        </em>
      </Text>
      <p>
        You must read our{' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="/termsConditions">
            terms and conditions
          </a>
        </strong>
        ,{' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="/privacy">
            privacy policy
          </a>
        </strong>{' '}
        and{' '}
        <strong>
          <a target="_blank" rel="noreferrer" href="/childrenPrivacy">
            privacy policy for children
          </a>
        </strong>{' '}
        before giving us your consent and authorisation.
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            How You Can Get, Give and Revoke Consent
          </span>
        </em>
      </Text>
      <p>
        As we rely on you to act as an agent and provide us with consent and authorisation on
        parents&apos; behalf. You must therefore notify your students&apos; parents and obtain the
        required verifiable parental consents before registering accounts for the Authorised
        Students. You can download our{' '}
        <strong>
          <a download href="/parentalConsentForm.docx">
            Sample verifiable consent form
          </a>
        </strong>{' '}
        and determine how best to use it. You must keep signed verifiable parental consents on file
        and provide them to us upon our request.
      </p>
      <p>
        We recommend that you make this notice available to parents so that they may review the
        personal information collected.
      </p>
      <p>
        You may revoke your consent at any time to refuse further collection and use of the
        Authorised Student&apos;s person information by contacting us and providing us necessary
        information for processing.
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>
            No Collection Without Obtaining Consent
          </span>
        </em>
      </Text>
      <p>
        We will not collect, use or disclose any personal information from the Authorised Students
        without your consent and authorisation and, if you believe that you have accidentally
        provided with such personal information, please contact us as soon as possible and we will
        delete such personal information from our records upon your notification and request.
      </p>
      <p>
        Once you provide us with the consent and authorisation on parents&apos; behalf, we will
        collect, use and/or disclose students&apos; personal information for your authorised
        educational purpose.
      </p>
      <Text className={classes.subTitle}>
        <em>
          <span style={{ textDecoration: 'underline' }}>Contact Us</span>
        </em>
      </Text>
      <p>
        If you have any questions, please don&apos;t hesitate to contact us. We are happy to help.
      </p>
      <p>For US:</p>
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
        <li>By post to Optoma Technology Inc., 47697 Westinghouse Dr, Fremont, CA 94539, USA.</li>
      </ul>
      <p>For Asia Pacific:</p>
      <ul>
        <li>
          Email <a href="mailto:opt.gdpr@optoma.com">opt.gdpr@optoma.com</a>
          <span style={{ textDecoration: 'underline' }}>; or</span>
        </li>
        <li>
          By post to Optoma Corporation,12F, NO. 213, SEC. 3, Beixin Rd., Xindian Dist., New Taipei
          Cit, Taiwan.
        </li>
      </ul>
      <p>For other countries:</p>
      <ul>
        <li>
          Email <a href="mailto:gdpr@optoma.co.uk">gdpr@optoma.co.uk</a>; or
        </li>
        <li>
          By post to Optoma Europe Ltd, 1 Bourne End Mills, Hemel Hempstead, HP1 2UJ, United
          Kingdom; or
        </li>
        <li>Call +44 (0) 1923 691 800.</li>
      </ul>
      <Divider my={rem(30)} />
      <Text className={classes.copyright}>Copyright 2024 Optoma Corporation</Text>
    </AppShell>
  );
}
