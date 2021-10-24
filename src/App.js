import React, {useState} from "react";
import {useForm, Controller, useFieldArray} from "react-hook-form";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from "yup";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

const schema = yup.object().shape({
    name: yup.string().required(),
    code: yup.string().required(),
    fieldType: yup.mixed().oneOf(['text', 'multiple']).required(),
    field: yup.array()
        .when('fieldType', {
            is: 'multiple',
            then: yup
                .array(
                    yup
                        .object()
                        .shape({
                            name: yup.string().required('Name is required'),
                            value: yup.string().required('Value is required')
                        })
                )
                .min(1)
                .required()
        })
}).required();
const emptyField = { name: "", surname: "" };

function App() {
    const [type, setType] = useState("text");
    const {control, handleSubmit, formState: { isValid, isDirty }} = useForm({
        mode: "onChange",
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            code: "",
            fieldType: "text",
            field: [{...emptyField}],
        }
    });
    const {fields, append, remove} = useFieldArray({
        control,
        name: "field",
    });

    const handleFieldRemove = (index) => remove(index);
    const submitForm = (data) => console.log(data);
    const handleFieldAdd = () => append({...emptyField});

    return (
        <div style={{width: "600px", outline: "1px #e0e0e0 solid", padding: "10px"}}>
            <form onSubmit={handleSubmit(submitForm)}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Controller
                            name="name"
                            control={control}
                            render={({field, fieldState}) => {
                                const hasError = !!fieldState.error;
                                return <TextField
                                    fullWidth
                                    size="small"
                                    label="Name"
                                    variant="outlined"
                                    placeholder="Department"
                                    error={hasError}
                                    helperText={hasError ? fieldState.error.message : null}
                                    {...field}
                                />
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="code"
                            control={control}
                            render={({field, fieldState}) => {
                                const hasError = !!fieldState.error;
                                return <TextField
                                    fullWidth
                                    size="small"
                                    label="Code"
                                    variant="outlined"
                                    placeholder="DEP"
                                    error={hasError}
                                    helperText={hasError ? fieldState.error.message : null}
                                    {...field}
                                />
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Type</FormLabel>
                            <Controller
                                name="fieldType"
                                control={control}
                                render={({field: {onChange, ...rest}}) => {
                                    return (
                                        <RadioGroup
                                            defaultValue="text"
                                            name="radio-buttons-group"
                                            {...rest}
                                            onChange={(e) => {
                                                setType(e.target.value);
                                                onChange(e.target.value)
                                            }}
                                        >
                                            <FormControlLabel value="text" control={<Radio/>} label="Text"/>
                                            <FormControlLabel value="multiple" control={<Radio/>}
                                                              label="Multiple Choice"/>
                                        </RadioGroup>
                                    );
                                }}
                            />
                        </FormControl>
                    </Grid>

                    {type === "multiple" && (
                        <>
                            {fields.map((field, index) => (
                                <Grid item xs={12} container spacing={2} key={field.id}>
                                    <Grid item xs={6}>
                                        <Controller
                                            name={`field.${index}.name`}
                                            control={control}
                                            render={({field, fieldState}) => {
                                                const hasError = !!fieldState.error;
                                                return <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Filed name"
                                                    variant="outlined"
                                                    placeholder="Engineering"
                                                    error={hasError}
                                                    helperText={hasError ? fieldState.error.message : null}
                                                    {...field}
                                                />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <Controller
                                            name={`field.${index}.value`}
                                            control={control}
                                            render={({field, fieldState}) => {
                                                const hasError = !!fieldState.error;
                                                return <TextField
                                                    fullWidth
                                                    size="small"
                                                    label="Value"
                                                    variant="outlined"
                                                    placeholder="ENG"
                                                    error={hasError}
                                                    helperText={hasError ? fieldState.error.message : null}
                                                    {...field}
                                                />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={() => handleFieldRemove(index)} aria-label="delete">
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
                            <Grid item xs={12}>
                                <Button variant="text" onClick={handleFieldAdd}>+ Add value</Button>
                            </Grid>
                        </>
                    )}

                    <Grid item xs={12}>
                        <Stack spacing={2} direction="row-reverse">
                            <Button variant="contained" type="submit" disabled={!isValid || !isDirty}>Save</Button>
                            <Button variant="outlined">Cancel</Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}

export default App;
