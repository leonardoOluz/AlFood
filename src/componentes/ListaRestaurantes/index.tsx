import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios, { AxiosRequestConfig } from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [ordenacao, setOrdenacao] = useState('');

  const carregarDados = (url: string, opcoes: AxiosRequestConfig = {}) => {

    axios.get<IPaginacao<IRestaurante>>(url, opcoes)
      .then(response => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
        setPaginaAnterior(response.data.previous);
      })
      .catch(error => {
        console.log(error)
      })
  }

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/')
  }, []);

  const verMais = (url: string) => {
    carregarDados(url)
  }

  const aoBuscar = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const opcoes = {
      params: {
      } as IParametrosBusca
    }

    if (pesquisa) {
      opcoes.params.search = pesquisa;
    }

    if (ordenacao) {
      opcoes.params.ordering = ordenacao;
    }
    carregarDados('http://localhost:8000/api/v1/restaurantes/', opcoes);
  }

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <form onSubmit={aoBuscar}>
        <select
          name='selecao-ordenacao'
          id='selecao-ordenacao'
          value={ordenacao}
          onChange={e => setOrdenacao(e.target.value)}
        >
          <option value='' >Padrão</option>
          <option value='nome' >Nome</option>
          <option value='id'>Por ID</option>
        </select>
        <input
          onChange={e => setPesquisa(e.target.value)}
          value={pesquisa}
          type="text"
          placeholder='Pesquisar'
        />
        <button type='submit'>Pesquisar</button>
      </form>
      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      <div className={style.containerPaginacao}>
        {paginaAnterior && <button onClick={() => verMais(paginaAnterior)} disabled={!paginaAnterior}>Pagina anterior</button>}
        {proximaPagina && <button onClick={() => verMais(proximaPagina)} disabled={!proximaPagina}>Proxima pagina</button>}
      </div>
    </section>
  )
}

export default ListaRestaurantes