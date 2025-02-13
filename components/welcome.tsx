import { Flex, rem, Text, Image, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Carousel } from '@mantine/carousel';
import React, { memo, useRef } from 'react';
import { CarouselProps } from '@mantine/carousel/lib/Carousel';
import Autoplay from 'embla-carousel-autoplay';
import {
  DisplayShareSignIcon,
  InfoBoardSignIcon,
  OamSignIcon,
  OmsSignIcon,
  WhiteboardSignIcon,
} from './base/icon';

const WelcomeSlide = () => {
  const { t } = useTranslation();

  return (
    <Flex h="100%" direction="column" justify="center">
      <Text color="#FFFFFF" ta="center" fw={500} fz="48px" mb="24px">
        {t('Welcome_to_Optoma_Account_Service')}
      </Text>
      <Flex gap={20} justify="center">
        <OamSignIcon />
        <OmsSignIcon />
        <WhiteboardSignIcon />
        <InfoBoardSignIcon />
        <DisplayShareSignIcon />
      </Flex>
      <Text color="#FFFFFF" ta="center" fw={400} fz="20px" mt="24px" mb="24px" px="20px">
        {t('Welcome_content')}
      </Text>
    </Flex>
  );
};

const OMSIntroSlide = () => {
  const { t } = useTranslation();

  return (
    <Flex h="100%" direction="column" justify="center">
      <Flex align="center" pb="1.7%">
        <OmsSignIcon width={36} height={36} />
        <Text color="#FFFFFF" fw={500} fz="26px" ml="md">
          {t('OMS_management_suite')}
        </Text>
      </Flex>
      <Flex align="center" pb="5.1%">
        <Image src="/assets/oms.png" alt="OMS Intro" fit="contain" />
      </Flex>
      <Flex direction="column" h="28%" pb="2.2%">
        <Text color="#FFFFFF" ta="center" fw={700} fz="16px" pb="1%">
          {t('OMS_intro_title')}
        </Text>
        <Text color="#FFFFFF" ta="center" fw={500} fz="16px">
          {t('OMS_intro1')}
        </Text>
        <Text color="#FFFFFF" ta="center" fw={500} fz="16px">
          {t('OMS_intro2')}
        </Text>
      </Flex>
      <Flex justify="center" pb="3.4%">
        <Button
          style={{ width: rem(240) }}
          component="a"
          href="https://oms.optoma.com/"
          target="_blank"
          variant="white"
          radius="xl"
          styles={() => ({
            root: {
              color: '#415284',
              fontWeight: 400,
            },
          })}
        >
          {t('Go_to_OMS')}
        </Button>
      </Flex>
    </Flex>
  );
};

const WhiteboardIntroSlide = () => {
  const { t } = useTranslation();

  return (
    <Flex h="100%" direction="column" justify="center">
      <Flex align="center" pb="1.7%">
        <WhiteboardSignIcon width={36} height={36} />
        <Text color="#FFFFFF" fw={500} fz="26px" ml="md">
          {t('Whiteboard')}
        </Text>
      </Flex>
      <Flex align="center" pb="5.1%">
        <Image src="/assets/wb.png" alt="Whiteboard Intro" fit="contain" />
      </Flex>
      <Flex direction="column" h="28%" pb="2.2%">
        <Text color="#FFFFFF" ta="center" fw={700} fz="16px" pb="1%">
          {t('Whiteboard_intro_tile')}
        </Text>
        <Text color="#FFFFFF" ta="center" fw={500} fz="16px">
          {t('Whiteboard_intro1')}
        </Text>
      </Flex>
      <Flex justify="center" pb="3.4%">
        <Button
          style={{ width: rem(240) }}
          component="a"
          href="https://whiteboard.optoma.com/"
          target="_blank"
          variant="white"
          radius="xl"
          styles={() => ({
            root: {
              color: '#415284',
              fontWeight: 400,
            },
          })}
        >
          {t('Go_to_Whiteboard')}
        </Button>
      </Flex>
    </Flex>
  );
};

const InfoBoardIntroSlide = () => {
  const { t } = useTranslation();

  return (
    <Flex h="100%" direction="column" justify="center">
      <Flex align="center" pb="1.7%">
        <InfoBoardSignIcon width={36} height={36} />
        <Text color="#FFFFFF" fw={500} fz="26px" ml="md">
          {t('InfoBoard')}
        </Text>
      </Flex>
      <Flex align="center" pb="5.1%">
        <Image src="/assets/ib.png" alt="InfoBoard Intro" fit="contain" />
      </Flex>
      <Flex direction="column" h="28%" pb="2.2%">
        <Text color="#FFFFFF" ta="center" fw={700} fz="16px" pb="1%">
          {t('InfoBoard_intro_title')}
        </Text>
        <Text color="#FFFFFF" ta="center" fw={500} fz="16px">
          {t('InfoBoard_intro1')}
        </Text>
      </Flex>
      <Flex justify="center" pb="3.4%">
        <Button
          style={{ width: rem(240) }}
          component="a"
          href="https://infoboard.optoma.com/"
          target="_blank"
          variant="white"
          radius="xl"
          styles={() => ({
            root: {
              color: '#415284',
              fontWeight: 400,
            },
          })}
        >
          {t('Go_to_InfoBoard')}
        </Button>
      </Flex>
    </Flex>
  );
};

const Welcome = (props: CarouselProps) => {
  const autoplay = useRef(Autoplay({ delay: 8000 }));

  return (
    <Carousel
      withControls={false}
      withIndicators
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      styles={{
        root: {
          height: '100%',
          width: '100%',
          minWidth: '360px',
        },
        viewport: {
          height: '100%',
        },
        container: {
          height: '100%',
        },
        indicators: {
          bottom: '-1.5%',
          gap: rem(20),
        },
        indicator: {
          width: rem(8),
          height: rem(8),
        },
      }}
      {...props}
    >
      <Carousel.Slide>
        <WelcomeSlide />
      </Carousel.Slide>
      <Carousel.Slide>
        <OMSIntroSlide />
      </Carousel.Slide>
      <Carousel.Slide>
        <WhiteboardIntroSlide />
      </Carousel.Slide>
      <Carousel.Slide>
        <InfoBoardIntroSlide />
      </Carousel.Slide>
    </Carousel>
  );
};

export default memo(Welcome);
