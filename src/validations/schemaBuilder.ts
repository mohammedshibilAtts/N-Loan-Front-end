import * as Yup from "yup";

export interface ValidationField {
  _id?: any;
  name: string;
  label: string;
  required?: boolean;
  placeHolder?: string;
  min?: number;
  max?: number;
  minAmount?: number;
  maxAmount?: number;
  type?:
  | "string"
  | "number"
  | "email"
  | "password"
  | "confirmPassword"
  | "dropdown"
  | "date"
  | "file"
  | "text"
  | "checkbox"
  | "amount";
  minLength?: number;
  maxLength?: number;
  isPast?: boolean;
  options?: any;
  visible?:Boolean
}

export const buildValidationSchema = (fields: ValidationField[]) => {
  const schema: Record<string, Yup.AnySchema> = {};

  fields.forEach((field) => {
    const {
      name,
      label,
      min,
      max,
      required,
      type = "string",
      minLength,
      maxLength,
      isPast = true,
      minAmount,
      maxAmount,
      // visible=true
    } = field;

    let validator: Yup.AnySchema = Yup.string();

    switch (type) {
      case "number":
        validator = Yup.string().test(
          "is-number",
          `${label} must be a valid number`,
          (val) => !val || /^\d+(\.\d*)?$/.test(val)
        );

        if (minLength !== undefined) {
          validator = validator.test(
            "minLength",
            `${label} must be exactly ${minLength} digits`,
            (val) => !val || val.length === minLength
          );
        }

        if (maxLength !== undefined) {
          validator = validator.test(
            "maxLength",
            `${label} must be exactly ${maxLength} digits`,
            (val) => !val || val.length === maxLength
          );
        }
        break;

      case "email":
        validator = Yup.string().email("Invalid email format");
        break;

      case "password":
        validator = Yup.string();
        if (required === true) {
          validator = validator.required(`${label} is required`);
        }
        break;

      case "confirmPassword":
        validator = Yup.string()
          .oneOf([Yup.ref("password")], "Passwords must match")
          .when("password", (password, schema) => {
            if (required === true && password) {
              return schema.required(`${label} is required`);
            }
            return schema;
          });
        break;

      case "string": {
        if (typeof min === "number") {
          validator = Yup.string().min(
            min,
            `${label} must be at least ${min} characters`
          );
        }

        if (typeof max === "number") {
          validator = Yup.string().max(
            max,
            `${label} cannot exceed ${max} characters`
          );
        }

        break;
      }

      case "text": {
        if (typeof minLength === "number") {
          validator = Yup.string().min(
            minLength,
            `${label} must be at least ${minLength} characters`
          );
        }

        if (typeof maxLength === "number") {
          validator = Yup.string().max(
            maxLength,
            `${label} cannot exceed ${maxLength} characters`
          );
        }

        break;
      }

      case "amount":
        {

          let amountValidator: Yup.NumberSchema<number> = Yup.number()
            .typeError(`${label} must be a number`)
            .required(`${label} is required`);

          if (typeof minAmount === "number") {
            amountValidator = amountValidator.min(
              minAmount,
              `${label} must be at least ${minAmount}`
            );
          }

          if (typeof maxAmount === "number") {
            amountValidator = amountValidator.max(
              maxAmount,
              `${label} cannot exceed ${maxAmount}`
            );
          }

          validator = amountValidator;
          break;
        }

        break;

      case "dropdown":
        if (required) {
          validator = Yup.string().required(`${label} is required`);
        }
        break;

      // case 'date':
      //     validator = Yup.date().typeError(`${label} must be a valid date`)
      //       [ isPast ? 'min' : 'max'](
      //         new Date(),
      //         isPast ? `${label} cannot be in the past` : `${label} cannot be in the future`
      //       );

      //     if (isPast) {
      //       validator = validator.min(new Date('1900-01-01'), `${label} cannot be before 01/01/1900`);
      //     }

      //     break;

      case "date":
        const today = new Date();
        const minDate = new Date("1900-01-01");
        const maxFutureDate = new Date("3000-01-01");

        validator = Yup.date()
          .typeError(`${label} must be a valid date`)
          .min(minDate, `${label} cannot be before 01/01/1900`);

        if (isPast) {
          validator = Yup.date().max(today, `${label} cannot be in the future`);
        } else {
          validator = Yup.date().max(
            maxFutureDate,
            `${label} cannot be after 01/01/3000`
          );
        }

        break;

      case "file":
        validator = Yup.mixed().nullable();
        break;

      default:
        validator = Yup.string();
    }

    if (required === true) {
      validator = validator.required(`${label} is required`);
    }

    schema[name] = validator;
  });

  return Yup.object().shape(schema);
};

// import * as Yup from 'yup';

// export type ValidationField = {
//     label: string,
//     name: string;
//     placeHolder?: string;
//     required?: boolean;
//     min?: number;
//     max?: number;
//     type?: 'string' | 'email' | 'number' | 'password' | 'file' | 'date' | 'checkbox' | 'autocomplete' | 'text' | 'time' | 'dropdown' | 'radio' | 'confirmPassword';
//     value?: any;
//     options?: string[];
//     minLength?:number
//     maxLength?:number
// };

// export const buildValidationSchema = (fields: ValidationField[]) => {
//     const schema: Record<string, Yup.Schema> = {};

//     fields.forEach(({ name, label, required = true, min, max, type = 'string',minLength=null,maxLength=null }) => {
//         let validator;

//         if (type === 'number') {
//             validator = Yup.number()
//                 .typeError(`${label} must be a number`)
//                 .min(min ?? 0, `${label} must be at least ${min}`)
//                 .max(max ?? Infinity, `${label} cannot exceed ${max}`);

//                 if (minLength) validator = validator.min(minLength, `${label} must be at least ${minLength} characters`);
//                 if (maxLength) validator = validator.max(maxLength, `${label} cannot exceed ${maxLength} characters`);

//         } else if (type === 'email') {
//             validator = Yup.string().email('Invalid email format');
//         } else {
//             validator = Yup.string();
//             if (min) validator = validator.min(min, `${label} must be at least ${min} characters`);
//             if (max) validator = validator.max(max, `${label} cannot exceed ${max} characters`);
//         }

//         if (required) validator = validator.required(`${label} is required`);

//         schema[name] = validator;
//     });

//     return Yup.object().shape(schema);
// };
