import React, { useCallback } from 'react';
import { CSSObject, createStyles } from '@mantine/core';
import { ReactSVG, Props } from 'react-svg';
import SearchSvg from '../../public/images/search.svg';
import SearchGreySvg from '../../public/images/searchGrey.svg';
import SearchBlackSvg from '../../public/images/searchBlack.svg';
import CloseSvg from '../../public/images/large-error.svg';
import FilterSvg from '../../public/images/filter.svg';
import OverflowMenuSvg from '../../public/images/overflow-menu.svg';
import CheckedSvg from '../../public/images/checkbox-checked.svg';
import IndeterminateSvg from '../../public/images/checkbox-indeterminate.svg';
import ArrowDownSvg from '../../public/images/arrow-down.svg';
import ArrowUpSvg from '../../public/images/arrow-up.svg';
import ArrowDownDisabledSvg from '../../public/images/arrow-down-disabled.svg';
import ListAscendingSvg from '../../public/images/list-ascending.svg';
import ListDescendingSvg from '../../public/images/list-descending.svg';
import DevicesSvg from '../../public/images/devices.svg';
import SignInSvg from '../../public/images/signin.svg';
import DashboardSvg from '../../public/images/dashboard.svg';
import HistorySvg from '../../public/images/history.svg';
import RefreshSvg from '../../public/images/refresh.svg';
import FooterDashBoard from '../../public/images/footerDashboard.svg';
import PlusDarkSvg from '../../public/images/plusDark.svg';
import UserImportSvg from '../../public/images/userImport.svg';
import UserAssignSvg from '../../public/images/userAssign.svg';
import UserDeleteSvg from '../../public/images/userDelete.svg';
import DeleteSvg from '../../public/images/delete.svg';
import PlusSvg from '../../public/images/plus.svg';
import SuccessSvg from '../../public/images/success.svg';
import ErrorSvg from '../../public/images/error.svg';
import RenewSvg from '../../public/images/renew.svg';
import PremiumBottomBar from '../../public/images/PremiumPurplebar.svg';
import PresentBox from '../../public/images/present-body.svg';
import PresentCap from '../../public/images/present-cap.svg';
import PremiumBackBar from '../../public/images/PremiumBack.svg';
import Check from '../../public/images/Check.svg';
import PremiumBtn from '../../public/images/PremiumBtn.svg';
import mobileBackbar from '../../public/images/mobile-backbar.svg';
import mobileBottomBar from '../../public/images/mobile-bottomBar.svg';
import mobileBtn from '../../public/images/mobile-button.svg';
import infoSvg from '../../public/images/info.svg';
import displayShareSvg from '../../public/images/displayShare.svg';
import omsSvg from '../../public/images/oms.svg';
import whiteboardSvg from '../../public/images/whiteboard.svg';
import backSvg from '../../public/images/back.svg';
import oamSvg from '../../public/images/oam-logo-blue.svg';
import oamWhiteSvg from '../../public/images/oam-logo-white.svg';
import showSvg from '../../public/images/passwordShow.svg';
import hideSvg from '../../public/images/passwordHide.svg';
import lightLanguageSvg from '../../public/images/light-language.svg';
import darkLanguageSvg from '../../public/images/dark-language.svg';
import licenseExtendSvg from '../../public/images/license-extend.svg';
import licenseCollpaseSvg from '../../public/images/license-collpase.svg';
import notificationsSvg from '../../public/images/notifications.svg';
import servicesSvg from '../../public/images/services.svg';
import dialogCloseSvg from '../../public/images/dialog-close.svg';
import contactSvg from '../../public/images/contact.svg';
import displayShareSignSvg from '../../public/images/displayShare-sign.svg';
import infoBoardSignSvg from '../../public/images/infoBoard-sign.svg';
import oamSignSvg from '../../public/images/OAM-sign.svg';
import omsSignSvg from '../../public/images/OMS-sign.svg';
import whiteboardSignSvg from '../../public/images/whiteboard-sign.svg';

interface Icon extends Omit<Props, 'src'> {
  disabled?: boolean;
  width?: number | string;
  height?: number | string;
  fill?: string;
  // stroke?: string;
}

const useStyles = createStyles((theme, style: CSSObject) => ({
  div: {
    div: {
      display: 'flex',
      alignItems: 'center',
    },
  },
  svg: {
    svg: style,
    'svg:active': {
      transform: 'none', // translateY(0)
    },
    'svg:focus': { outline: 'none' },
    'svg:is([icon-disabled])': {
      opacity: 0.4,
    },
  },
}));

function makeSvgIcon(svgSrc: {
  height: number | string;
  width: number | string;
  src: string;
  blurWidth?: number | string;
  blurHeight?: number | string;
}) {
  return React.forwardRef((props: Icon, ref: any) => {
    const { classes, cx } = useStyles(props.style as CSSObject);
    const { width, height, fill, disabled, className, ...restProps } = props;
    const { width: svgWidth, height: svgHeight, blurWidth, blurHeight, ...rest } = svgSrc;

    const beforeInjectionCallback = useCallback(
      (svg: SVGSVGElement) => {
        svg.setAttribute('width', (width || svgWidth).toString());
        svg.setAttribute('height', (height || svgHeight).toString());
        if (disabled) svg.setAttribute('icon-disabled', 'true');
        else svg.removeAttribute('icon-disabled');
      },
      [disabled, width, height, svgWidth, svgHeight],
    );

    return (
      <ReactSVG
        ref={ref}
        {...restProps}
        {...rest}
        className={cx(classes.div, classes.svg, className)}
        // afterInjection={(svg) => console.log(svg)}
        beforeInjection={beforeInjectionCallback}
        wrapper="div"
      />
    );
  });
}

export const DevicesIcon = makeSvgIcon(DevicesSvg);
export const DashboardIcon = makeSvgIcon(DashboardSvg);
export const FooterDashBoardIcon = makeSvgIcon(FooterDashBoard);
export const SignInIcon = makeSvgIcon(SignInSvg);
export const HistoryIcon = makeSvgIcon(HistorySvg);
export const SearchIcon = makeSvgIcon(SearchSvg);
export const SearchGreyIcon = makeSvgIcon(SearchGreySvg);
export const SearchBlackIcon = makeSvgIcon(SearchBlackSvg);
export const CloseIcon = makeSvgIcon(CloseSvg);
export const FilterIcon = makeSvgIcon(FilterSvg);
export const OverflowMenuIcon = makeSvgIcon(OverflowMenuSvg);
export const CheckedIcon = makeSvgIcon(CheckedSvg);
export const IndeterminateIcon = makeSvgIcon(IndeterminateSvg);
export const ArrowDownIcon = makeSvgIcon(ArrowDownSvg);
export const ArrowUpIcon = makeSvgIcon(ArrowUpSvg);
export const ArrowDownDisabledIcon = makeSvgIcon(ArrowDownDisabledSvg);
export const ListAscendingIcon = makeSvgIcon(ListAscendingSvg);
export const ListDescendingIcon = makeSvgIcon(ListDescendingSvg);
export const RefreshIcon = makeSvgIcon(RefreshSvg);
export const PlusDarkIcon = makeSvgIcon(PlusDarkSvg);
export const UserImportIcon = makeSvgIcon(UserImportSvg);
export const UserAssignIcon = makeSvgIcon(UserAssignSvg);
export const UserDeleteIcon = makeSvgIcon(UserDeleteSvg);
export const DeleteIcon = makeSvgIcon(DeleteSvg);
export const PlusIcon = makeSvgIcon(PlusSvg);
export const SuccessIcon = makeSvgIcon(SuccessSvg);
export const ErrorIcon = makeSvgIcon(ErrorSvg);
export const RenewIcon = makeSvgIcon(RenewSvg);
export const PremiumBottomBarIcon = makeSvgIcon(PremiumBottomBar);
export const PresentBoxIcon = makeSvgIcon(PresentBox);
export const PresentCapIcon = makeSvgIcon(PresentCap);
export const PremiumBackBarIcon = makeSvgIcon(PremiumBackBar);
export const PremiumCheckIcon = makeSvgIcon(Check);
export const PremiumBtnIcon = makeSvgIcon(PremiumBtn);
export const MobileBackbarIcon = makeSvgIcon(mobileBackbar);
export const MobileBottomBarIcon = makeSvgIcon(mobileBottomBar);
export const MobileBtnIcon = makeSvgIcon(mobileBtn);
export const InfoIcon = makeSvgIcon(infoSvg);
export const DisplayShareIcon = makeSvgIcon(displayShareSvg);
export const OmsIcon = makeSvgIcon(omsSvg);
export const WhiteboardIcon = makeSvgIcon(whiteboardSvg);
export const BackIcon = makeSvgIcon(backSvg);
export const OamIcon = makeSvgIcon(oamSvg);
export const OamWhiteIcon = makeSvgIcon(oamWhiteSvg);
export const PasswordShowIcon = makeSvgIcon(showSvg);
export const PasswordHideIcon = makeSvgIcon(hideSvg);
export const LightLanguageIcon = makeSvgIcon(lightLanguageSvg);
export const DarkLanguageIcon = makeSvgIcon(darkLanguageSvg);
export const LicenseExtendIcon = makeSvgIcon(licenseExtendSvg);
export const LicenseCollpaseIcon = makeSvgIcon(licenseCollpaseSvg);
export const notificationsIcon = makeSvgIcon(notificationsSvg);
export const servicesIcon = makeSvgIcon(servicesSvg);
export const DialogCloseIcon = makeSvgIcon(dialogCloseSvg);
export const ContactIcon = makeSvgIcon(contactSvg);
export const DisplayShareSignIcon = makeSvgIcon(displayShareSignSvg);
export const InfoBoardSignIcon = makeSvgIcon(infoBoardSignSvg);
export const OamSignIcon = makeSvgIcon(oamSignSvg);
export const OmsSignIcon = makeSvgIcon(omsSignSvg);
export const WhiteboardSignIcon = makeSvgIcon(whiteboardSignSvg);
