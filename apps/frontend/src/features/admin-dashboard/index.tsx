import { Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAdminDashboard } from './hook.ts'

export function AdminDashboard() {
  const {
    clients,
    colors,
    isLoadingClients,
    isLoadingColors,
    deletingClientId,
    deletingColorId,
    colorForm,
    isCreatingColor,
    hexCodePreview,
    onCreateColor,
    onDeleteClient,
    onDeleteColor,
  } = useAdminDashboard()
  const {
    register,
    formState: { errors },
  } = colorForm

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Clientes cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingClients ? (
            <p className="text-sm text-muted-foreground">Carregando clientes...</p>
          ) : clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.fullName}</TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.color}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon-sm"
                        aria-label={`Remover ${client.fullName}`}
                        disabled={deletingClientId === client.id}
                        onClick={() => onDeleteClient(client.id)}
                      >
                        <Trash2 />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cores disponíveis</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {isLoadingColors ? (
            <p className="text-sm text-muted-foreground">Carregando cores...</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {colors.map((color) => (
                <li key={color.id} className="flex items-center justify-between gap-2 rounded-lg border p-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-4 rounded-full ring-1 ring-foreground/10"
                      style={{ backgroundColor: color.hexCode }}
                    />
                    <span className="text-sm">{color.name}</span>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    aria-label={`Remover ${color.name}`}
                    disabled={deletingColorId === color.id}
                    onClick={() => onDeleteColor(color.id)}
                  >
                    <Trash2 />
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <form
            onSubmit={onCreateColor}
            className="flex flex-col gap-4 border-t pt-4"
          >
            <FieldGroup>
              <div className="flex flex-col gap-4 @md/field-group:flex-row">
                <Field data-invalid={!!errors.name}>
                  <Input placeholder="Nome da cor" {...register('name')} />
                  {errors.name && <FieldError errors={[errors.name]} />}
                </Field>
                <Field data-invalid={!!errors.hexCode}>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="h-9 w-14 shrink-0 cursor-pointer rounded-md border border-input p-1"
                      aria-label="Selecionar cor"
                      {...register('hexCode')}
                    />
                    <span className="text-sm text-muted-foreground">{hexCodePreview}</span>
                  </div>
                  {errors.hexCode && <FieldError errors={[errors.hexCode]} />}
                </Field>
              </div>
            </FieldGroup>
            <Button type="submit" disabled={isCreatingColor} className="self-start">
              {isCreatingColor ? 'Adicionando...' : 'Adicionar cor'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
