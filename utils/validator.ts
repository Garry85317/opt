export type Validator = (
  value: unknown,
  values?: unknown,
) =>
  | string
  | number
  | true
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | React.ReactFragment;

export function chainValidator(validator1: Validator, validator2: Validator) {
  return (value: unknown, values: unknown) =>
    validator1(value, values) ? validator1(value, values) : validator2(value, values);
}
