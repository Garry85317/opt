import React from 'react';
import { CSSObject, createStyles } from '@mantine/core';
import { ReactSVG, Props } from 'react-svg';
import ContentSvg from '../../public/images/content.svg';
import ContentMidSvg from '../../public/images/content-mid.svg';
import ContentMinSvg from '../../public/images/content-min.svg';
import OptomaSvg from '../../public/images/Optoma.svg';

interface Icon extends Omit<Props, 'src'> {
  width?: number | string;
  height?: number | string;
}

const useStyles = createStyles((theme, style: CSSObject) => ({
  div: {
    div: {
      display: 'flex',
      alignItems: 'center',
      height: 'fill-available',
    },
  },
  svg: {
    svg: style,
    'svg:active': {
      transform: 'none', // translateY(0)
    },
    'svg:focus': { outline: 'none' },
  },
}));

function makeSvgImg(svgSrc: {
  height: number | string;
  width: number | string;
  src: string;
  blurWidth?: number | string;
  blurHeight?: number | string;
}) {
  return React.forwardRef((props: Icon, ref: any) => {
    const { classes, cx } = useStyles(props.style as CSSObject);
    const { width, height, className, ...restProps } = props;
    const { width: svgWidth, height: svgHeight, blurWidth, blurHeight, ...rest } = svgSrc;

    return (
      <ReactSVG
        ref={ref}
        {...restProps}
        {...rest}
        className={cx(classes.div, classes.svg, className)}
        // afterInjection={(svg) => console.log(svg)}
        beforeInjection={(svg) => {
          svg.setAttribute('height', 'auto');
        }}
        wrapper="div"
      />
    );
  });
}

export const ContentImage = makeSvgImg(ContentSvg);
export const ContentMidImage = makeSvgImg(ContentMidSvg);
export const ContentMinImage = makeSvgImg(ContentMinSvg);
export const OptomaImage = makeSvgImg(OptomaSvg);
