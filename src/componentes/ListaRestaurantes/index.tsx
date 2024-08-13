import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [proximaPagina, setProximaPagina] = useState('');
  const [paginaAnterior, setPaginaAnterior] = useState('');

  useEffect(() => {
    axios.get<IPaginacao<IRestaurante>>('http://localhost:8000/api/v1/restaurantes/')
      .then(response => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const verMais = (url: string) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(response => {
        setRestaurantes(response.data.results);
        setProximaPagina(response.data.next);
        setPaginaAnterior(response.data.previous);
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (<section className={style.ListaRestaurantes}>
    <h1>Os restaurantes mais <em>bacanas</em>!</h1>
    {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
    {paginaAnterior && <button onClick={() => verMais(paginaAnterior)} disabled={!paginaAnterior}>Pagina anterior</button>}
    {proximaPagina && <button onClick={() => verMais(proximaPagina)} disabled={!proximaPagina}>Proxima pagina</button>}
  </section>)
}

export default ListaRestaurantes