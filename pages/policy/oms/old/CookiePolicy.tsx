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
  title3: {
    fontWeight: 700,
    paddingTop: '0.25rem',
    paddingBottom: '0.25rem',
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
  list2: {
    listStyleType: 'none',
    paddingLeft: rem(40),
  },
  list3: {
    listStyleType: 'disc',
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
  tablehead1: {
    backgroundColor: 'rgb(136 136 136 / 1)',
    color: 'rgb(255 255 255 / 1)',
  },
  tablehead2: {
    borderWidth: rem(1),
    borderColor: 'rgb(209 213 219 / 1)',
    padding: '0.75rem',
  },
  td1: {
    borderWidth: rem(1),
    borderColor: 'rgb(209 213 219 / 1)',
    padding: '0.75rem',
    minWidth: rem(250),
  },
  td2: {
    borderWidth: rem(1),
    borderColor: 'rgb(209 213 219 / 1)',
    padding: '0.75rem',
    minWidth: rem(150),
  },
}));

export function CookiePolicy() {
  const { t } = useTranslation();
  const { classes } = useDashboardStyles();
  document.title = t('CookiePolicy');

  let link = { textDecoration: 'underline', color: '#fff' };

  return (
    <div>
      <header className={classes.header1}>
        <a href="/">
          <img src={logo.src} alt="optoma" className={classes.image1}></img>
        </a>
      </header>
      <div className={classes.section1}>
        <h2 className={classes.title1}>Cookie Policy</h2>
        <h3 className={classes.title2}>Use of Cookies</h3>
        <ul className={classes.list3}>
          <li>anonymous -- the information cannot be used to personally identify you.</li>
          <li>used to help us manage and improve our service platform and our website.</li>
          <li>used to manage promotions, competitions and surveys.</li>
          <li>
            administer and operate any accounts you log in to on our service platform, our website
            or any information you submit.
          </li>
        </ul>
        <br />
        <p className={classes.content1}>Cookies used on the service platform and website:</p>
        <ul className={classes.list3}>
          <li>
            Strictly necessary cookies – cookies which enable services you have specifically asked
            for; these cookies are essential for the site to function.
          </li>
          <li>
            Performance and behavior cookies – these cookies are not necessary for the site to
            function, but we use them to gather information on how visitors use our site and to help
            us make improvements to our site. We do not collect any information which may be used to
            personally identify you; all the information is aggregated and anonymous.
          </li>
        </ul>
        <br />
        <p className={classes.content1}>Using browser settings to manage cookies</p>
        <ul className={classes.list3}>
          <li>
            The Help menu on the menu bar of most browsers will tell you how to prevent your browser
            from accepting new cookies, how to have the browser notify you when you receive a new
            cookie and how to disable cookies altogether. You can also disable or delete similar
            data used by browser add-ons, such as Flash cookies, by changing the add-on's settings
            or visiting the website of its manufacturer.
          </li>
          <li>
            However, because cookies allow you to take advantage of some of the service platform’s
            and website’s essential features, we recommend you leave them turned on. For example, if
            you block or otherwise reject cookies you will not be able to log in to any area of our
            service platform or our website, or enter any competitions or promotions we run on the
            service platform or website.
          </li>
        </ul>
      </div>
      <footer className={classes.footer1}>
        Copyright © 2021 Optoma Corporation. All rights reserved.&nbsp;
        <a href="/TermCondition" style={link}>
          Term Condition and Conditions of Use
        </a>
        &nbsp;and&nbsp;
        <a href="/PrivacyPolicy" style={link}>
          Privacy Policy
        </a>
      </footer>
    </div>
  );
}

export default CookiePolicy;
