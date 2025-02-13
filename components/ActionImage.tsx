import React, { memo, useMemo, useState } from 'react';
import { useHover } from '@mantine/hooks';
import { Image } from '@mantine/core';
import { ImageProps } from '@mantine/core/lib/Image/Image';

export interface ActionImageProps extends ImageProps, React.RefAttributes<HTMLDivElement> {
  hover?: string;
  normal: string;
  pressed?: string;
}

const ActionImage = (prop: ActionImageProps) => {
  const { hovered, ref } = useHover();
  const [isPressed, setPressed] = useState(false);

  const image = useMemo(() => {
    if (isPressed) {
      return prop.pressed;
    }
    if (hovered) {
      return prop.hover;
    }
    return prop.normal;
  }, [hovered, isPressed]);

  return (
    <Image
      ref={ref}
      {...prop}
      src={image}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
    />
  );
};

export default memo(ActionImage);
