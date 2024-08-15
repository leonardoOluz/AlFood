import {
  Button, TextField, Typography, Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";
import { useNavigate, useParams } from "react-router-dom";
import IPrato from "../../../interfaces/IPrato";

const FormularioPratos = () => {
  const [nomePrato, setNomePrato] = useState('');
  const [descricaoPrato, setDescricaoPrato] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [tag, setTag] = useState('');
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])
  const [restaurante, setRestaurante] = useState('')
  const [file, setFiles] = useState<File | null>(null)
  const paramns = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
      .then(response => setTags(response.data.tags))
      .catch(error => console.log(error));
    http.get<IRestaurante[]>('restaurantes/')
      .then(response => setRestaurantes(response.data))
      .catch(error => console.log(error));
  }, [])

  useEffect(() => {
    if (paramns.id) {
      http.get<IPrato>(`pratos/${paramns.id}/`)
        .then(response => {
          const { nome, descricao, tag, restaurante } = response.data;
          setNomePrato(nome)
          setDescricaoPrato(descricao)
          setTag(tag)
          setRestaurante(String(restaurante))
        })
    }
  }, [paramns.id])

  const selectFile = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setFiles(evento.target.files[0])
    } else {
      setFiles(null)
    }
  }

  const limpaCampos = () => {
    setNomePrato('')
    setDescricaoPrato('')
    setTag('')
    setRestaurante('')
    setFiles(null)
  }

  const aoSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('nome', nomePrato)
    formData.append('descricao', descricaoPrato)
    formData.append('tag', tag)
    formData.append('restaurante', restaurante)

    if (file) {
      formData.append('imagem', file)
    }

    if (paramns.id) {
      http.putForm(`pratos/${paramns.id}/`, formData)
        .then((response) => {
          console.log(response)
          limpaCampos();
          alert('Prato atualizado com sucesso')
          navigate('/admin/pratos')
        })
        .catch(error => console.log(error))
    } else {
      http.request({
        url: 'pratos/',
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
        .then(() => {
          limpaCampos();
          alert('Prato registrado com sucesso')
          navigate('/admin/pratos')
        })
        .catch(error => console.log(error))
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
      <Typography component="h1" variant="h6">Formulario de Pratos</Typography>
      <Box component='form' onSubmit={aoSubmitForm} sx={{ width: '100%' }}>
        <TextField
          value={nomePrato}
          onChange={e => setNomePrato(e.target.value)}
          label="Nome do prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricaoPrato}
          onChange={e => setDescricaoPrato(e.target.value)}
          label="Descrição"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />

        <FormControl margin="dense" fullWidth sx={{ paddingTop: '10px' }}>
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select labelId="select-tag" value={tag} onChange={event => setTag(event.target.value)}>
            {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
              {tag.value}
            </MenuItem>)}
          </Select>
        </FormControl>

        <FormControl margin="dense" fullWidth sx={{ paddingTop: '10px' }}>
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select labelId="select-restaurante" value={restaurante} onChange={event => setRestaurante(event.target.value)}>
            {restaurantes.map(restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
              {restaurante.nome}
            </MenuItem>)}
          </Select>
        </FormControl>

        <input type="file" onChange={selectFile} />

        <Button sx={{ marginTop: 1 }} fullWidth type="submit" variant="outlined">Salvar</Button>
      </Box>
    </Box>
  )
}

export default FormularioPratos;