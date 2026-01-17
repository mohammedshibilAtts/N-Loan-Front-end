import { useMemo } from 'react';
import { buildValidationSchema, ValidationField } from './schemaBuilder';

export const useValidation = (fields: ValidationField[]) => {
  return useMemo(() => buildValidationSchema(fields), [fields]);
};
