import React, { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Criação do contexto
const PokemonContext = createContext();

const PokemonList = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonDetails, setPokemonDetails] = useState([]);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=20');
        const results = response.data.results;

        const pokemonDetails = await Promise.all(results.map(async (pokemon) => {
          const pokemonResponse = await axios.get(pokemon.url);
          return {
            name: pokemon.name,
            image: pokemonResponse.data.sprites.front_default,
          };
        }));

        setPokemonList(pokemonDetails);
      } catch (error) {
        console.error('Error fetching Pokemon list:', error);
      }
    };

    fetchPokemonList();
  }, []);

  return (
    <div>
      <h1>Pokémon List</h1>
      <PokemonContext.Provider value={pokemonDetails}>
        <PokemonDetails />
      </PokemonContext.Provider>
      {pokemonList.map((pokemon) => (
        <div key={pokemon.name}>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
      ))}
    </div>
  );
};

const PokemonDetails = () => {
  const pokemonDetails = useContext(PokemonContext);

  return (
    <div>
      <h1>Pokémon Details</h1>
      {pokemonDetails.map((pokemon) => (
        <div key={pokemon.name}>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.image} alt={pokemon.name} />
        </div>
      ))}
    </div>
  );
};

export default PokemonList;