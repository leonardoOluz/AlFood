import {
  Button, TextField, Typography, Box
  } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";
import http from "../../../http";

const FormularioRestaurante = () => {
  const paramentros = useParams();
  const [nomeRestaurante, setNomeRestaurante] = useState('');

  useEffect(() => {
    if (paramentros.id) {
      http.get<IRestaurante>(`restaurantes/${paramentros.id}/`)
        .then(response => setNomeRestaurante(response.data.nome))
        .catch(error => console.log(error))
    }
  }, [paramentros])

  const aoSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (paramentros.id) {
      http.put<IRestaurante>(`restaurantes/${paramentros.id}/`, {
        nome: nomeRestaurante
      })
        .then(() => alert('Atualizado com sucesso!'))
        .catch(error => console.log(error));

    } else {
      http.post('restaurantes/', {
        nome: nomeRestaurante
      })
        .then(() => {
          alert('Cadastro concluído')
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
      <Typography component="h1" variant="h6">Formulario de Restaurantes</Typography>
      <Box component='form' onSubmit={aoSubmitForm} sx={{ width: '100%' }}>
        <TextField
          value={nomeRestaurante}
          onChange={e => setNomeRestaurante(e.target.value)}
          label="Nome do Restaurante"
          variant="standard"
          fullWidth
          required
        />
        <Button sx={{ marginTop: 1 }} fullWidth type="submit" variant="outlined">Salvar</Button>
      </Box>
    </Box>
  )
}

export default FormularioRestaurante;