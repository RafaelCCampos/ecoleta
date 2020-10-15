import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import axios from 'axios';

import './styles.css';

import logo from '../../assets/logo.svg';
import oleo from '../../assets/oleo.svg';
import { LeafletMouseEvent } from 'leaflet';

interface IBGFEUFResponse {
    sigla: string;
}

interface IBGECITYResponse {
    nome: string;
}

const CreatePoint = () => {
    const [ufs, setUfs] = useState<string[]>([]);
    const [citys, setCitys] = useState<string[]>([]);
    const [markedPosition, setMarkedPosition] = useState<[number, number]>([0,0]);
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    const [ufSelected, setUfSelected] = useState('');
    
    useEffect(() => {
        axios.get<IBGFEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            ufInitials.sort();
            setUfs(ufInitials);
        })
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;
            setInitialPosition([latitude, longitude]);
        })
    },[]);

    useEffect(() => {
        axios.get<IBGECITYResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelected}/municipios`)
        .then(response => {
            const cityResponse = response.data.map(city => city.nome);
            setCitys(cityResponse);
        })
    }, [ufSelected]);
    
    function ufChange(uf: string) {
        setUfSelected(uf);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        setMarkedPosition([
        event.latlng.lat,
        event.latlng.lng
        ])
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta"/>

                <Link to="/">
                    <FiArrowLeft/>
                    Voltar para home
                </Link>
            </header>

            <form>
                <h1>Cadastro do ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input 
                            type="text"
                            name="name"
                            id="name"
                        />
                    </div>
                
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input 
                                type="email"
                                name="email"
                                id="email"
                            />
                    </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input 
                                type="text"
                                name="whatsapp"
                                id="whatsapp"
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={12} onclick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={markedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                                name="uf" 
                                id="uf"
                                onChange={e => { ufChange(e.target.value)}}
                                value={ufSelected}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => {
                                    return <option key={uf} value={uf}>{uf}</option>
                                })}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {citys.map(city => {
                                    return <option key={city}value={city}>{city}</option>
                                })}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>selecione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        <li>
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                        <li className="selected">
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                        <li>
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                        <li>
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                        <li>
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                        <li>
                            <img src={oleo} alt="Óleo de cozinha"/>
                            <span>Óleo de cozinha</span>
                        </li>
                    </ul>
                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint;