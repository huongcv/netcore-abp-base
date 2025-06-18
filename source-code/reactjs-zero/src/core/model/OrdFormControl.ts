import * as React from "react";
import type {Rule} from "rc-field-form/lib/interface";

export interface OrdFormControl {
    label?: React.ReactNode;
    required?: boolean;
    hidden?: boolean;
    initialValue?: any;
    rules?: Rule[];
}
