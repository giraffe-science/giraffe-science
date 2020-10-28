import {makeStyles, Theme as DefaultTheme} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";

export type CustomClass =
    "appBar"
    | "content"
    | "contentText"
    | "h1Giraffe"
    | "h1Scientific"
    | "resourceCard"
    | "resourceCardContent"
    | "resourceLink"
    | "resourceTitle"
    | "resourceType"
    | "resourceDate";
export const useClasses: (props?: any) => ClassNameMap<CustomClass> = makeStyles<DefaultTheme, CustomClass>((theme => (
    {
        appBar: {
            color: "#222",
            backgroundColor: "#fff",
            boxShadow: "none"
        },
        content: {
            maxWidth: "750px",
            minHeight: "750px"
        },
        contentText: {
            marginTop:"20px"
        },
        h1Scientific: {
            fontSize: 31.5,
            letterSpacing: 3,
            lineHeight: 0.75,
        },
        h1Giraffe: {
            fontSize: 44,
            letterSpacing: 3,
            lineHeight: 0.75,
        },
        resourceCard: {
            boxShadow: "none",
            height: "100%",
        },
        resourceCardContent: {
            textAlign: "left",
            padding: "0"
        },
        resourceLink: {
            textDecoration: "none",
            color: theme.palette.text.primary,
            fontWeight: "bold",
            "&:hover": {
                color: theme.palette.primary.main
            }
        },
        resourceType: {
            fontSize: 14,
            textAlign: "left",
            fontWeight: "bold"
        },
        resourceDate: {
            fontSize: 14,
            textAlign: "left",
            fontWeight: "normal"
        },
        resourceTitle: {
            fontSize: 18,
            textAlign: "left",
            paddingBottom: "10px"
        }
    }
)));
const primary = "#B06B32";
const baseTheme = createMuiTheme({
    typography: {
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        h1: {
            fontFamily: 'Georgia, serif',
            fontSize: 32,
            color:"#1a1a1a",
        },
        h2: {
            fontSize: 24,
            fontWeight:"bold",
            color:"#B06B32",
        },
        h3: {
            fontSize: 20,
            fontWeight:"bold",
            color:"#585858",
        },
        h5: {
            fontFamily: 'Georgia, serif',
        },
        body1 :{
            color: "#323232",
        },
        body2 :{
            color: "#656565",
        }
    },
    palette: {
        background: {
            default: "#fff"
        },
        primary: {
            main: primary
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [],
                a: {
                    textDecoration: "none",
                    color: primary
                }
            },
        }
    },
});
export const theme = responsiveFontSizes(baseTheme);
