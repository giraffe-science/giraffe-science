import {Variant} from "@material-ui/core/styles/createTypography";
import Typography from "@material-ui/core/Typography";
import Markdown from "markdown-to-jsx";
import React from "react";

export type TypographyColor = 'initial'
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'textPrimary'
    | 'textSecondary'
    | 'error';

export function GiraffeLi({children, variant, color}: {
    children: any,
    variant?: Variant,
    color?: TypographyColor
}) {
    return <li><Typography variant={variant} color={color}>{children}</Typography></li>;
}

export function GiraffeMarkdown({children, color}: {
    children: any,
    color?: TypographyColor
}) {
    return <Markdown
        style={{marginTop: "15px"}}
        options={{
            disableParsingRawHTML: true, overrides: {
                h1: {component: Typography, props: {variant:"h1", color, style: {marginBottom: "15px"}}},
                h2: {component: Typography, props: {variant:"h2", color, style: {marginBottom: "15px"}}},
                h3: {component: Typography, props: {variant:"h3", color, style: {marginBottom: "15px"}}},
                h4: {component: Typography, props: {variant:"h4", color, style: {marginBottom: "15px"}}},
                p: {component: Typography, props: {color, style: {marginBottom: "15px"}}},
                li: {component: GiraffeLi, props: {color}}
            }
        }}>{children}</Markdown>;
}
