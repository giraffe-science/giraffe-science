import {makeStyles, Theme as DefaultTheme} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import {ClassNameMap} from "@material-ui/core/styles/withStyles";

export type CustomClass =
    "appBar"
    | "h1Giraffe"
    | "h1Scientific"
    | "resourceCard"
    | "resourceCardContent"
    | "resourceCardActions"
    | "resourceTitle"
    | "resourceType" |"resourceDate";
export const useClasses: (props?: any) => ClassNameMap<CustomClass> = makeStyles<DefaultTheme, CustomClass>((theme => (
    {
        appBar: {
            color: "#222",
            backgroundColor: "#fff",
            boxShadow: "none"
        },
        h1Scientific: {
            fontSize: 40,
            letterSpacing: 3
        },
        h1Giraffe: {
            fontSize: 55,
            letterSpacing: 3,
        },
        resourceCard: {
            boxShadow: "none",
            height:"100%",
        },
        resourceCardContent: {
            textAlign: "left",
            padding: "0"
        },
        resourceCardActions: {
            padding: "15px 0 0 0",
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
const baseTheme = createMuiTheme({
    typography: {
        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
        h1: {
            fontFamily: 'Georgia, serif',
            lineHeight: 0.75,
        }
    },
    palette: {
        background: {
            default: "#fff"
        }
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [],
            },
        },
    },
});
export const theme = responsiveFontSizes(baseTheme);