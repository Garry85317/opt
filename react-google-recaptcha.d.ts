declare module 'react-google-recaptcha' {
  import * as React from 'react';

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    theme?: 'light' | 'dark';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    asyncScriptOnLoad?: () => void;
  }

  class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset: () => void;
  }

  export default ReCAPTCHA;
}
