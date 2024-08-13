import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioReaturante = () => {
  const paramentros = useParams();
  const [nomeRestaurante, setNomeRestaurante] = useState('');

  useEffect(() => {
    if (paramentros.id) {
      axios.get<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${paramentros.id}/`)
        .then(response => setNomeRestaurante(response.data.nome))
        .catch(error => console.log(error))
    }
  }, [paramentros])

  const aoSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (paramentros.id) {
      axios.put<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${paramentros.id}/`,{
        nome: nomeRestaurante
      })
      .then(() => alert('Atualizado com sucesso!'))
      .catch(error => console.log(error));

    } else {
      axios.post('http://localhost:8000/api/v2/restaurantes/', {
        nome: nomeRestaurante
      })
        .then(() => {
          alert('Cadastro concluído')
        })
        .catch(error => console.log(error))
    }
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