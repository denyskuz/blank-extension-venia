import React from "react";
import { useStyle } from "@magento/venia-ui/lib/classify";
import defaultClasses from "./index.module.css";
import { useCustomExtension } from "../talons";

const CustomExtension = (props) => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div></div>
    )
}

export default CustomExtension;
