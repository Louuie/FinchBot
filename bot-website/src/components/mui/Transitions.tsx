import Slide from '@mui/material/Slide/Slide';
import { TransitionProps } from '@mui/material/transitions/transition';
import * as React from 'react';

export const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });