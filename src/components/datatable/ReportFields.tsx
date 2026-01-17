import { ValidationField } from "../../validations/schemaBuilder";




export const itemWise: ValidationField[] = [

    {
        name: "branch",
        label: "Branch",
        placeHolder: "Select Branch",
        type: "dropdown",
        required: true,
    },
    {
        name: "metalId",
        label: "Select Metal",
        placeHolder: "Enter First Name",
        type: "dropdown",
        required: true,
    },
    {
        name: "purityId",
        label: "Select Purity",
        placeHolder: "Enter Last Name",
        required: true,
        type: "dropdown",
    },
    {
        name: "itemId",
        label: "Select Item",
        required: true,
        type: "dropdown",
    },
];

