"use client";

import { loginAction } from "@/src/actions/auth/login-user-action";
import { Button } from "@/src/components/Button";
import { ContainerAuth } from "@/src/components/ContainerAuth";
import { InputText } from "@/src/components/InputText";
import Link from "next/link";
import { useActionState, useEffect } from "react";

const initialState = {
  success: false,
  data: {
    email: "",
  },
  errors: [],
};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success && state.errors && state.errors?.length > 0) {
      console.log("chamou????");
      console.log(state.errors);
    }
  }, [state]);

  return (
    <ContainerAuth>
      <form
        action={formAction}
        className="flex flex-col justify-around h-full p-6"
      >
        <div className="flex flex-col gap-6">
          <InputText
            labelText="Email"
            type="text"
            id="email"
            name="email"
            defaultValue={state.data.email}
          />

          <InputText
            labelText="Senha"
            type="password"
            id="password"
            name="password"
          />
        </div>

        <div className="flex justify-center gap-6">
          <Button buttonText="Entrar" type="submit" />
          <Link
            href="/register"
            className="border-2 border-blue-700 rounded-md px-2 py-1"
          >
            Registrar
          </Link>
        </div>
      </form>
    </ContainerAuth>
  );
}
