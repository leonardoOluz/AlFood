import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const FormularioReaturante = () => {
  const [nomeRestaurante, setNomeRestaurante] = useState('');

  const aoSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post('http://localhost:8000/api/v2/restaurantes/', {
      nome: nomeRestaurante
    })
    .then(() => {
      alert('Cadastro concluído')
    })
    .catch(error => console.log(error))
  }

  return (<form onSubmit={aoSubmitForm}>
    <TextField
      value={nomeRestaurante}
      onChange={e => setNomeRestaurante(e.target.value)}
      label="Nome do Restaurante"
      variant="standard"
    />
    <Button type="submit" variant="outlined">Outlined</Button>
  </form>)
}

export default FormularioReaturante;