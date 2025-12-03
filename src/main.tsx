import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { persistor, store } from "./app/store"
import "./index.css"
import { PersistGate } from "redux-persist/integration/react"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const tabStyle = {
  "&.MuiButtonBase-root": {
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.63)",
    maxWidth: "max-content", padding: "4px 12px", borderRadius: "8px",
    margin: "4px 4px", minHeight: "24px", textTransform: "none",
    fontFamily: "var(--App-font-family)",
  },
  "&.Mui-selected": {
    backgroundColor: "var(--AppBar-background)",
    color: "white",
    fontWeight: "bold",
  }
};

const theme = createTheme({
  components: {

    MuiAppBar: {
      styleOverrides: {
        root: {
          minHeight: "40px",
        },
      },
    },

    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "0 12px",
          "& .MuiCardHeader-avatar": {
            marginRight: "4px",
            padding: "4px",
          },
        },
        content: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        },
        title: {
          fontSize: "1.1rem",
          fontWeight: "600",
        },
        subheader: {
          fontSize: "0.8rem",
          marginTop: "4px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "0 8px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.63)",
          margin: "4px 0"
        },

      }
    },
    MuiTab: {
      styleOverrides: {
        root: tabStyle,
      },
    },
    MuiTabs: {
      styleOverrides: {
        "root": {
          width: "100%",
        },
        "indicator": {
          display: "none"
        },
        "scroller": {
          display: "flex",
          padding: "4px",
        }

      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: "40px",
          "@media (min-width:600px)": {
            minHeight: "40px", // override the responsive rule
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "var(--App-font-family)",
        }
      }
    },
  },

});


const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </StrictMode>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
