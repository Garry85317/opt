import { useTranslation } from 'react-i18next';
import logo from '../../../../public/optomaLogo@3x.png'; // with import
import { createStyles, rem } from '@mantine/core';

const useDashboardStyles = createStyles((theme) => ({
  header1: {
    width: '96%',
    padding: '20px 0px 20px 0px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  image1: {
    width: '12%',
    minWidth: rem(150),
  },
  section1: {
    width: '90%',
    paddingBottom: rem(60),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title1: {
    fontSize: '2.25rem',
    lineHeight: '2.5rem',
    fontWeight: 700,
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
  },
  title2: {
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: 700,
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
  },
  content1: {
    lineHeight: '1.3rem',
    marginBottom: '0.5rem',
    color: 'rgb(85 85 85 / 1)',
  },
  list1: {
    listStyleType: 'decimal',
    paddingLeft: rem(40),
  },
  footer1: {
    position: 'fixed',
    bottom: rem(0),
    left: rem(0),
    width: '100%',
    backgroundColor: 'rgb(0 0 0 / 1)',
    paddingLeft: rem(50),
    paddingRight: rem(50),
    paddingTop: rem(10),
    paddingBottom: rem(10),
    textAlign: 'center',
    color: 'rgb(255 255 255 / 1)',
  },
}));

export function TermCondition() {
  const { t } = useTranslation();
  const { classes } = useDashboardStyles();
  document.title = t('TermCond');

  let link = { textDecoration: 'underline', color: '#fff' };

  return (
    <div>
      <header className={classes.header1}>
        <a href="/">
          <img src={logo.src} alt="optoma" className={classes.image1}></img>
        </a>
      </header>
      <div className={classes.section1}>
        <h2 className={classes.title1}>Terms and Conditions</h2>
        <h3 className={classes.title2}>Notice</h3>
        <p className={classes.content1}>
          All rights, including but not limited to copyright and database right, on the Optoma
          Corporation service platform and website (hereinafter called “Website”) and its contents
          (including but not limited to text, photographs, graphics and software) are owned by or
          licensed to Optoma Corporation or are otherwise used by Optoma Corporation as permitted by
          applicable law. In accessing Optoma Corporation’s Website, you agree that you will access
          the contents solely for your own personal, non-commercial use, except as set out below.
          You are not permitted to copy, download, store (including in any other website),
          distribute, transmit, broadcast, adapt or change in any way the contents on the Website
          for any other purpose without Optoma Corporation's prior written permission.
        </p>
        <h3 className={classes.title2}>Terms and Conditions</h3>
        <p className={classes.content1}>
          Access to and use of this Website shall be subject to the following terms and conditions:
        </p>
        <ul className={classes.list1}>
          <li>
            Use of this Website constitutes your acceptance of these terms and conditions which
            takes effect on the date on which you first use the Website. Optoma Corporation reserves
            the right at its sole discretion, to add to or change these terms and conditions at any
            time by posting changes on-line and it is your responsibility to refer to and comply
            with these existing terms on accessing the Website. Your continued use of this site
            after changed terms are posted constitutes your acceptance of these terms and conditions
            as modified. Use of this Website also constitutes your acceptance of Privacy Policy
            published and modified by Optoma Corporation from time to time and you should read
            before you use this Website.
          </li>
          <li>
            You acknowledge that all intellectual property rights, including but not limited to
            copyright and database right, of contents on the Website belong to or have been licensed
            to Optoma Corporation or are otherwise used by Optoma Corporation as permitted by
            applicable law.
          </li>
          <li>
            In accessing the Website you agree to access the contents solely for your own personal,
            non-commercial use. Except as set out in Section 4, you are not permitted to copy,
            download, store in any medium (including any other website), distribute, transmit,
            modify or show in public any part of the Website without the prior written permission of
            Optoma Corporation or in accordance with the international convention or treaty
            regarding the Intellectual Property Right.
          </li>
          <li>
            Optoma Corporation makes some materials in the Website available for you to download by
            clicking on the image or text for promoting Optoma Corporation's Projector, Screen,
            accessory or digital signage sales. You may download images and text from this Website
            and use the material you have downloaded for the sole purpose of promoting the sale of
            Optoma Corporation products without obtaining further consent from Optoma Corporation,
            provided that you do not alter extracts of text which you quote and that you only use
            images which you download in their entirety without modifying them in any way (other
            than reducing their size and superimposing a price, e.g. a reduced price). You
            acknowledge Optoma Corporation prominently in relation to every image and/or textual
            extract, which you use; and if you quote any extract from an Optoma Corporation title
            you also agree to identify Optoma Corporation as the source. You also agree that you
            will not use any material from the Website in any way, which may be derogatory of the
            material itself. If you wish to make any alterations to images or text, you shall obtain
            Optoma Corporation's prior written consent.
          </li>
          <li>
            Links to the Website must be direct to the Optoma Management Suite (
            <a href="/" rel="noopener" target="_blank">
              https://oms.optoma.com/
            </a>
            ) homepage. Optoma Corporation disclaims all liability for any legal or other
            consequences (including for infringement of third party rights) of links made to the
            Website.
          </li>
          <li>
            Optoma Corporation provides the material published on the Website on the basis that it
            makes no express or implied warranties in respect of the products listed. Optoma
            Corporation exclude to the fullest extent permitted by applicable law all liability for
            any damages or losses and for any direct, indirect, incidental or consequential loss of
            business, anticipated savings, revenues or profits or goodwill or reputation or special
            damages or loss arising from the publication of the material on the Website.
          </li>
          <li>
            Optoma Corporation is not responsible for the content of any material you encounter
            after leaving the Website via a link in it or otherwise and Optoma Corporation excludes
            to the fullest extent permitted by applicable law all liability that may arise in
            respect of such material.
          </li>
          <li>
            All information or material contained in this Website is provided by Optoma Corporation
            on “as-is” basis , without any representation or warranty of accuracy or completeness of
            information or other warranty in any kind, including but not limited to implied or
            expressed warranty for quality, mechanism, fitness for any purpose or non-infringement.
          </li>
          <li>
            This Website shall be used by you only for lawful purposes and in a manner which does
            not infringe the rights of, or restrict or inhibit the use and enjoyment of the Website
            by, Optoma Corporation and any third party. Optoma Corporation has the right, at its
            sole discretion, to edit, refuse to post or remove any material submitted to or posted
            on the Website. In no event shall Optoma Corporation responsible for any material posted
            on the Website by persons other than Optoma Corporation. Any opinions, advice,
            statements, offers or other information expressed or made available by third parties on
            the Website are those of the third party concerned. Optoma Corporation neither endorses
            nor is responsible for the accuracy or reliability of any such third party’s material.
          </li>
          <li>
            These terms and conditions are governed by and will be interpreted in accordance with
            the laws of Taiwan, Republic of China, without reference to conflict of laws principles,
            and any disputes relating to these terms and conditions will be exclusively subject to
            the jurisdiction of the courts of Taipei, Taiwan. The various provisions of these terms
            and conditions are severable and if any provision is held to be invalid or unenforceable
            by any court of competent jurisdiction then such invalidity or unenforceability shall
            not affect the remaining provisions. If these terms and conditions are not accepted in
            full, use of this Website must be terminated immediately.
          </li>
          <li>
            All images of products are for representation purposes only. Whilst every care is taken
            to provide accurate images of our products, actual products may differ slightly. Some
            product images may have been digitally altered by us to add an Optoma logo to the front
            panel. Optoma Corporation reserves the right to amend or alter actual product or product
            images without notice.
          </li>
        </ul>
      </div>
      <footer className={classes.footer1}>
        Copyright © 2021 Optoma Corporation. All rights reserved.&nbsp;
        <a href="/CookiePolicy" style={link}>
          {'Cookie Policy'}
        </a>
        &nbsp;and&nbsp;
        <a href="/PrivacyPolicy" style={link}>
          {'Privacy Policy'}
        </a>
      </footer>
    </div>
  );
}

export default TermCondition;
