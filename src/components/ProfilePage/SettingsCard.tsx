import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CardContent from "@mui/material/CardContent";
import { Grid } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomInput from "./CustomInput.tsx";

interface UserData {
  name: string;
  email: string;
  role: string;
}

interface SettingsCardProps {
  expose: (message: string) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ expose }) => {
  // TAB STATES
  const [value, setValue] = useState<string>("one");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // Retrieve user data from local storage
  const userData: UserData = JSON.parse(localStorage.getItem("userData") || '{}');

  // FORM STATES
  const [user, setUser] = useState({
    name: userData.name || "",
    email: userData.email || "",
    role: userData.role || "",
  });

  const changeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  // BUTTON STATES
  const [edit, update] = useState({
    required: true,
    disabled: true,
    isEdit: true
  });

  // EDIT -> UPDATE
  const changeButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    edit.disabled = !edit.disabled;
    edit.isEdit = !edit.isEdit;
    update({ ...edit });
    console.log("user: ", user);
  };


  // RETURN
  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
      {/* TABS */}
      <br />
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="secondary"
        indicatorColor="secondary"
      >
        <Tab value="one" label="Account" />
        <Tab value="two" label="Settings" />
      </Tabs>
      <Divider />

      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" }
          }}
        >
          {value === "one" && (
            <FormControl fullWidth>
              <Grid
                container
                direction={{ xs: "column", md: "row" }}
                columnSpacing={5}
                rowSpacing={3}
              >
                {/* ROW 1: NAME */}
                <Grid item xs={6}>
                  <CustomInput
                    id="name"
                    name="name"
                    value={user.name}
                    onChange={changeField}
                    title="Nume"
                    dis={edit.disabled}
                    req={edit.required}
                  />
                </Grid>

                {/* ROW 2: EMAIL */}
                <Grid item xs={6}>
                  <CustomInput
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={changeField}
                    title="Adresa de email"
                    dis={edit.disabled}
                  />
                </Grid>

                {/* ROW 3: ROLE */}
                <Grid item xs={6}>
                  <CustomInput
                    id="role"
                    name="role"
                    value={user.role}
                    onChange={changeField}
                    title="Rol"
                    dis={edit.disabled}
                  />
                </Grid>

                {/* BUTTON */}
                <Grid
                  container
                  justifyContent={{ xs: "center", md: "flex-end" }}
                  item
                  xs={6}
                >
                  <Button
                    sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={changeButton}
                  >
                    {edit.isEdit === false ? "UPDATE" : "EDIT"}
                  </Button>
                </Grid>
              </Grid>
            </FormControl>
          )}

          {value === "two" && (
            <FormControl fullWidth>
              <Grid
                container
                direction={{ xs: "column", md: "row" }}
                columnSpacing={5}
                rowSpacing={3}
              >
                {/* ROW 1: SETTINGS CONTENT */}
                <Grid item xs={12}>
                  <CustomInput
                    id="settings"
                    name="settings"
                    value={user.settings || ""}
                    onChange={changeField}
                    title="Settings"
                    dis={edit.disabled}
                  />
                </Grid>
              </Grid>
            </FormControl>
          )}
        </CardContent>
      </form>
    </Card>
  );
};

export default SettingsCard;
