import type { Theme } from '@mui/material/styles';

import { experimental_extendTheme as extendTheme } from '@mui/material/styles';

import { shadows, typography, components, colorSchemes, customShadows } from './core';

// ----------------------------------------------------------------------

export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
    components: {
      ...components,
      MuiCheckbox: {
        styleOverrides: {
          root: {
            '&.Mui-checked': {
              color: 'black',
            },
          },
        },
      },
    },
  };

  const theme = extendTheme(initialTheme);

  return theme;
}

// ----------------------------------------------------------------------

function shouldSkipGeneratingVar(keys: string[]): boolean {
  const skipGlobalKeys = [
    'mixins',
    'overlays',
    'direction',
    'typography',
    'breakpoints',
    'transitions',
    'cssVarPrefix',
    'unstable_sxConfig',
  ];

  const skipPaletteKeys: {
    [key: string]: string[];
  } = {
    global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
    grey: ['A100', 'A200', 'A400', 'A700'],
    text: ['icon'],
  };

  const isPaletteKey = keys[0] === 'palette';

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;

    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}