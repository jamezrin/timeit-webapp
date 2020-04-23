import React from 'react';
import { Link } from 'react-router-dom';

import LoginRegisterLayout from './LoginRegisterLayout';
import FormInput from './base/FormInput';
import Button from './base/Button';
import FormLabel from './base/FormLabel';
import { useForm, Controller } from 'react-hook-form';
import FormDatePicker from './base/FormDatePicker';
import { RHFInput } from 'react-hook-form-input';

import "react-datepicker/dist/react-datepicker.css";


export default function RegisterForm() {
  //const registerEndpoint = process.env.REACT_APP_BACKEND_URL + '/create-account';
  // todo: https://medium.com/@everdimension/how-to-handle-forms-with-just-react-ac066c48bd4f
  // todo: https://www.google.com/search?q=react+send+form+data+to+api&oq=react+send+form&aqs=chrome.1.69i57j0l7.4768j0j7&sourceid=chrome&ie=UTF-8#kpvalbx=_MbebXvvfO-njgwfL0qf4Bg16

  const { handleSubmit, register, setValue, reset, control } = useForm();

  function onSubmit(data) {
    console.log(data)
  }

  return (
    <LoginRegisterLayout>
      <h1 className="text-3xl">Crea una cuenta</h1>
      <p className="pt-2">O si ya tienes una cuenta,&nbsp;
        <Link to="/login" className="text-blue-700">inicia sesión</Link>
      </p>

      <form
        className=""
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mt-4">
          <FormLabel htmlFor="emailAddress">Correo electrónico</FormLabel>
          <FormInput ref={register} name="emailAddress" id="emailAddress" />
        </div>

        <div className="mt-4">
          <FormLabel htmlFor="firstName">Nombre</FormLabel>
          <FormInput ref={register} name="firstName" id="firstName" />
        </div>

        <div className="mt-4">
          <FormLabel htmlFor="lastName">Apellidos</FormLabel>
          <FormInput ref={register} name="lastName" id="lastName" />
        </div>

        <div className="mt-4">
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <FormInput ref={register} type="password" name="password" id="password" />
        </div>

        <div className="mt-4">
          <FormLabel htmlFor="dateOfBirth">Fecha de Nacimiento</FormLabel>
          {/*<Controller
            as={<DatePicker
                locale="es"
                dateFormat="dd/MM/yyyy"
            />}
            control={control}
            valueName="selected"
            onChange={([selected]) => selected}
            name="dateOfBirth"
            className="input"
            placeholderText="Select date"
          />*/}
        </div>

        <div className="mt-4">
          <Button type="submit">Registrarme</Button>

        </div>

      </form>
    </LoginRegisterLayout>
  );
}
