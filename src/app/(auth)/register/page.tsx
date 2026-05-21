"use client";

import { createUserAction } from "@/src/actions/user/create-user-action";
import { Button } from "@/src/components/Button";
import { ContainerAuth } from "@/src/components/ContainerAuth";
import { InputText } from "@/src/components/InputText";
import Link from "next/link";
import { useActionState, useEffect } from "react";

const initialState = {
  success: false,
  data: {
    name: "",
    email: "",
  },
  errors: [],
  message: "",
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    createUserAction,
    initialState,
  );

  useEffect(() => {
    if (!state.success && state.errors && state.errors.length > 0) {
      console.log(state.errors);
    } else if (state.message) {
      console.log(state.message);
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
            labelText="Nome"
            type="text"
            name="name"
            id="name"
            defaultValue={state.data.name}
          />
          <InputText
            labelText="Email"
            type="email"
            name="email"
            id="email"
            defaultValue={state.data.email}
          />
          <InputText
            labelText="Senha"
            type="password"
            name="password"
            id="password"
          />
        </div>

        <div className="flex flex-col py-2 text-red-700">
          <span className="text-xs">Sem confirmação de senha</span>
          <span className="text-xs">Saiba exatamente o que colocou</span>
        </div>

        <div className="flex justify-center gap-6">
          <Button buttonText="Criar Conta" type="submit" />
          <Link
            href="/login"
            className="border-2 border-blue-700 rounded-md px-2 py-1"
          >
            Ir para Login
          </Link>
        </div>
      </form>
    </ContainerAuth>
  );
}
