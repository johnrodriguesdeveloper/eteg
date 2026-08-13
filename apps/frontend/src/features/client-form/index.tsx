import { Controller } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useClientForm } from './hook.ts'

export function ClientForm() {
  const { form, colors, isLoadingColors, isSubmitting, onSubmit } = useClientForm()
  const {
    control,
    register,
    formState: { errors },
  } = form

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-6 p-6"
    >
      <FieldGroup>
        <Field data-invalid={!!errors.fullName}>
          <FieldLabel htmlFor="fullName">Nome completo</FieldLabel>
          <Input id="fullName" placeholder="John Doe" {...register('fullName')} />
          {errors.fullName && <FieldError errors={[errors.fullName]} />}
        </Field>

        <Field data-invalid={!!errors.cpf}>
          <FieldLabel htmlFor="cpf">CPF</FieldLabel>
          <Input id="cpf" placeholder="Somente números" {...register('cpf')} />
          {errors.cpf && <FieldError errors={[errors.cpf]} />}
        </Field>

        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">E-mail</FieldLabel>
          <Input id="email" type="email" placeholder="john@doe.com" {...register('email')} />
          {errors.email && <FieldError errors={[errors.email]} />}
        </Field>

        <Controller
          name="color"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="color">Cor preferida</FieldLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isLoadingColors}
              >
                <SelectTrigger id="color" className="w-full">
                  <SelectValue
                    placeholder={
                      isLoadingColors ? 'Carregando cores...' : 'Selecione uma cor'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.name}>
                      {color.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field data-invalid={!!errors.notes}>
          <FieldLabel htmlFor="notes">Observações</FieldLabel>
          <Textarea id="notes" placeholder="Observações adicionais" {...register('notes')} />
          <FieldDescription>Campo opcional.</FieldDescription>
          {errors.notes && <FieldError errors={[errors.notes]} />}
        </Field>
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar cliente'}
      </Button>
    </form>
  )
}
