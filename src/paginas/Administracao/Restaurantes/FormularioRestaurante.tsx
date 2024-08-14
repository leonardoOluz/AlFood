import {
  Button, TextField, Typography, Box, AppBar,
  Container, Toolbar, Link, Paper
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link as RouterLink} from "react-router-dom";
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
    <>
      <AppBar position="static">
        <Container maxWidth='xl'>
          <Toolbar>
            <Typography variant="h6">
              Administração
            </Typography>
            <Box sx={{ display: 'flex', flexGrow: 1 }}>
              <Link component={RouterLink} to={'/admin/restaurantes'}>
                <Button sx={{ my: 2, color: 'white' }}>
                  Restaurante
                </Button>
              </Link>
              <Link component={RouterLink} to={'/admin/restaurantes/novo'}>
                <Button sx={{ my: 2, color: 'white' }}>
                  Novo Restaurante
                </Button>
              </Link>
            </Box>
          </Toolbar>    
        </Container>
      </AppBar>
      <Box>
        <Container maxWidth='lg' sx={{ mt: 1 }}>
          <Paper sx={{ p: 2 }}>

            {/* Conteudo da pagina */}
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

          </Paper>
        </Container>
      </Box>
    </>
  )
}

export default FormularioRestaurante;