import { Stack, Typography } from '@mui/material';
// import { ReactNode } from 'react';

interface BreadcrumbProps {
  items: {
    label: string;
    active?: boolean;
  }[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {items.map((item, index) => (
        <>
          {index > 0 && <Typography color="#637381">/</Typography>}
          <Typography
            variant="subtitle1"
            color={item.active ? '#1C252E' : '#637381'}
            fontWeight={item.active ? 'bold' : 'normal'}
          >
            {item.label}
          </Typography>
        </>
      ))}
    </Stack>
  );
};